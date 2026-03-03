import angle from './definitions/angle.js';
import apparentPower from './definitions/apparentPower.js';
import area from './definitions/area.js';
import current from './definitions/current.js';
import digital from './definitions/digital.js';
import each from './definitions/each.js';
import energy from './definitions/energy.js';
import frequency from './definitions/frequency.js';
import illuminance from './definitions/illuminance.js';
import length from './definitions/length.js';
import mass from './definitions/mass.js';
import pace from './definitions/pace.js';
import partsPer from './definitions/partsPer.js';
import power from './definitions/power.js';
import pressure from './definitions/pressure.js';
import reactiveEnergy from './definitions/reactiveEnergy.js';
import reactivePower from './definitions/reactivePower.js';
import speed from './definitions/speed.js';
import temperature from './definitions/temperature.js';
import time from './definitions/time.js';
import voltage from './definitions/voltage.js';
import volume from './definitions/volume.js';
import volumeFlowRate from './definitions/volumeFlowRate.js';

const measures = {
  length,
  area,
  mass,
  volume,
  each,
  temperature,
  time,
  digital,
  partsPer,
  speed,
  pace,
  pressure,
  current,
  voltage,
  power,
  reactivePower,
  apparentPower,
  energy,
  reactiveEnergy,
  volumeFlowRate,
  illuminance,
  frequency,
  angle,
};

class Converter {
  constructor(numerator, denominator) {
    this.val = denominator ? numerator / denominator : numerator;
    this.origin = null;
    this.destination = null;
  }

  from(from) {
    if (this.destination) {
      throw new Error('.from must be called before .to');
    }

    this.origin = this.getUnit(from);

    if (!this.origin) {
      this.throwUnsupportedUnitError(from);
    }

    return this;
  }

  to(to) {
    if (!this.origin) {
      throw new Error('.to must be called after .from');
    }

    this.destination = this.getUnit(to);

    if (!this.destination) {
      this.throwUnsupportedUnitError(to);
    }

    if (this.origin.abbr === this.destination.abbr) {
      return this.val;
    }

    if (this.destination.measure !== this.origin.measure) {
      throw new Error(`Cannot convert incompatible measures of ${this.destination.measure} and ${this.origin.measure}`);
    }

    let result = this.val * this.origin.unit.to_anchor;

    if (this.origin.unit.anchor_shift) {
      result -= this.origin.unit.anchor_shift;
    }

    if (this.origin.system !== this.destination.system) {
      const anchor = measures[this.origin.measure]._anchors[this.origin.system];
      if (typeof anchor.transform === 'function') {
        result = anchor.transform(result);
      } else {
        result *= anchor.ratio;
      }
    }

    if (this.destination.unit.anchor_shift) {
      result += this.destination.unit.anchor_shift;
    }

    return result / this.destination.unit.to_anchor;
  }

  toBest(opts = {}) {
    if (!this.origin) {
      throw new Error('.toBest must be called after .from');
    }

    const options = {
      exclude: [],
      cutOffNumber: 1,
      ...opts,
    };

    let best;

    this.possibilities().forEach(possibility => {
      const unit = this.describe(possibility);
      const isIncluded = !options.exclude.includes(possibility);

      if (isIncluded && unit.system === this.origin.system) {
        const result = this.to(possibility);

        if (!best || (result >= options.cutOffNumber && result < best.val)) {
          best = {
            val: result,
            unit: possibility,
            singular: unit.singular,
            plural: unit.plural,
          };
        }
      }
    });

    return best;
  }

  getUnit(abbr) {
    let found = null;

    Object.keys(measures).some(measure => {
      const systems = measures[measure];

      return Object.keys(systems).some(system => {
        if (system === '_anchors') return false;

        const units = systems[system];

        return Object.keys(units).some(testAbbr => {
          if (testAbbr !== abbr) return false;

          found = {
            abbr,
            measure,
            system,
            unit: units[testAbbr],
          };

          return true;
        });
      });
    });

    return found;
  }

  describe(abbr) {
    const resp = this.getUnit(abbr);

    if (!resp) {
      this.throwUnsupportedUnitError(abbr);
    }

    return {
      abbr: resp.abbr,
      measure: resp.measure,
      system: resp.system,
      singular: resp.unit.name.singular,
      plural: resp.unit.name.plural,
    };
  }

  list(measure) {
    const list = [];

    Object.keys(measures).forEach(testMeasure => {
      if (measure && measure !== testMeasure) return;

      const systems = measures[testMeasure];
      Object.keys(systems).forEach(system => {
        if (system === '_anchors') return;

        const units = systems[system];
        Object.keys(units).forEach(abbr => {
          const unit = units[abbr];

          list.push({
            abbr,
            measure: testMeasure,
            system,
            singular: unit.name.singular,
            plural: unit.name.plural,
          });
        });
      });
    });

    return list;
  }

  throwUnsupportedUnitError(what) {
    const validUnits = [];

    Object.keys(measures).forEach(measure => {
      const systems = measures[measure];

      Object.keys(systems).forEach(system => {
        if (system === '_anchors') return;
        validUnits.push(...Object.keys(systems[system]));
      });
    });

    throw new Error(`Unsupported unit ${what}, use one of: ${validUnits.join(', ')}`);
  }

  possibilities(measure) {
    const possibilities = [];

    if (!this.origin && !measure) {
      Object.keys(measures).forEach(group => {
        Object.keys(measures[group]).forEach(system => {
          if (system === '_anchors') return;
          possibilities.push(...Object.keys(measures[group][system]));
        });
      });
      return possibilities;
    }

    const targetMeasure = measure || this.origin.measure;

    Object.keys(measures[targetMeasure]).forEach(system => {
      if (system === '_anchors') return;
      possibilities.push(...Object.keys(measures[targetMeasure][system]));
    });

    return possibilities;
  }

  measures() {
    return Object.keys(measures);
  }
}

export default function convert(value) {
  return new Converter(value);
}
