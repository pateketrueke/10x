var global=globalThis;
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// src/lib/units/definitions/angle.js
var angle;
angle = {
  rad: {
    name: {
      singular: "radian",
      plural: "radians"
    },
    to_anchor: 180 / Math.PI
  },
  deg: {
    name: {
      singular: "degree",
      plural: "degrees"
    },
    to_anchor: 1
  },
  grad: {
    name: {
      singular: "gradian",
      plural: "gradians"
    },
    to_anchor: 9 / 10
  },
  arcmin: {
    name: {
      singular: "arcminute",
      plural: "arcminutes"
    },
    to_anchor: 1 / 60
  },
  arcsec: {
    name: {
      singular: "arcsecond",
      plural: "arcseconds"
    },
    to_anchor: 1 / 3600
  }
};
var angle_default = {
  metric: angle,
  _anchors: {
    metric: {
      unit: "deg",
      ratio: 1
    }
  }
};

// src/lib/units/definitions/apparentPower.js
var apparentPower;
apparentPower = {
  VA: {
    name: {
      singular: "Volt-Ampere",
      plural: "Volt-Amperes"
    },
    to_anchor: 1
  },
  mVA: {
    name: {
      singular: "Millivolt-Ampere",
      plural: "Millivolt-Amperes"
    },
    to_anchor: 0.001
  },
  kVA: {
    name: {
      singular: "Kilovolt-Ampere",
      plural: "Kilovolt-Amperes"
    },
    to_anchor: 1000
  },
  MVA: {
    name: {
      singular: "Megavolt-Ampere",
      plural: "Megavolt-Amperes"
    },
    to_anchor: 1e6
  },
  GVA: {
    name: {
      singular: "Gigavolt-Ampere",
      plural: "Gigavolt-Amperes"
    },
    to_anchor: 1e9
  }
};
var apparentPower_default = {
  metric: apparentPower,
  _anchors: {
    metric: {
      unit: "VA",
      ratio: 1
    }
  }
};

// src/lib/units/definitions/area.js
var metric;
var imperial;
metric = {
  mm2: {
    name: {
      singular: "Square Millimeter",
      plural: "Square Millimeters"
    },
    to_anchor: 1 / 1e6
  },
  cm2: {
    name: {
      singular: "Centimeter",
      plural: "Centimeters"
    },
    to_anchor: 1 / 1e4
  },
  m2: {
    name: {
      singular: "Square Meter",
      plural: "Square Meters"
    },
    to_anchor: 1
  },
  ha: {
    name: {
      singular: "Hectare",
      plural: "Hectares"
    },
    to_anchor: 1e4
  },
  km2: {
    name: {
      singular: "Square Kilometer",
      plural: "Square Kilometers"
    },
    to_anchor: 1e6
  }
};
imperial = {
  in2: {
    name: {
      singular: "Square Inch",
      plural: "Square Inches"
    },
    to_anchor: 1 / 144
  },
  yd2: {
    name: {
      singular: "Square Yard",
      plural: "Square Yards"
    },
    to_anchor: 9
  },
  ft2: {
    name: {
      singular: "Square Foot",
      plural: "Square Feet"
    },
    to_anchor: 1
  },
  ac: {
    name: {
      singular: "Acre",
      plural: "Acres"
    },
    to_anchor: 43560
  },
  mi2: {
    name: {
      singular: "Square Mile",
      plural: "Square Miles"
    },
    to_anchor: 27878400
  }
};
var area_default = {
  metric,
  imperial,
  _anchors: {
    metric: {
      unit: "m2",
      ratio: 10.7639
    },
    imperial: {
      unit: "ft2",
      ratio: 1 / 10.7639
    }
  }
};

// src/lib/units/definitions/current.js
var current;
current = {
  A: {
    name: {
      singular: "Ampere",
      plural: "Amperes"
    },
    to_anchor: 1
  },
  mA: {
    name: {
      singular: "Milliampere",
      plural: "Milliamperes"
    },
    to_anchor: 0.001
  },
  kA: {
    name: {
      singular: "Kiloampere",
      plural: "Kiloamperes"
    },
    to_anchor: 1000
  }
};
var current_default = {
  metric: current,
  _anchors: {
    metric: {
      unit: "A",
      ratio: 1
    }
  }
};

// src/lib/units/definitions/digital.js
var bits;
var bytes;
bits = {
  b: {
    name: {
      singular: "Bit",
      plural: "Bits"
    },
    to_anchor: 1
  },
  Kb: {
    name: {
      singular: "Kilobit",
      plural: "Kilobits"
    },
    to_anchor: 1024
  },
  Mb: {
    name: {
      singular: "Megabit",
      plural: "Megabits"
    },
    to_anchor: 1048576
  },
  Gb: {
    name: {
      singular: "Gigabit",
      plural: "Gigabits"
    },
    to_anchor: 1073741824
  },
  Tb: {
    name: {
      singular: "Terabit",
      plural: "Terabits"
    },
    to_anchor: 1099511627776
  }
};
bytes = {
  B: {
    name: {
      singular: "Byte",
      plural: "Bytes"
    },
    to_anchor: 1
  },
  KB: {
    name: {
      singular: "Kilobyte",
      plural: "Kilobytes"
    },
    to_anchor: 1024
  },
  MB: {
    name: {
      singular: "Megabyte",
      plural: "Megabytes"
    },
    to_anchor: 1048576
  },
  GB: {
    name: {
      singular: "Gigabyte",
      plural: "Gigabytes"
    },
    to_anchor: 1073741824
  },
  TB: {
    name: {
      singular: "Terabyte",
      plural: "Terabytes"
    },
    to_anchor: 1099511627776
  }
};
var digital_default = {
  bits,
  bytes,
  _anchors: {
    bits: {
      unit: "b",
      ratio: 1 / 8
    },
    bytes: {
      unit: "B",
      ratio: 8
    }
  }
};

// src/lib/units/definitions/each.js
var metric2;
metric2 = {
  ea: {
    name: {
      singular: "Each",
      plural: "Each"
    },
    to_anchor: 1
  },
  dz: {
    name: {
      singular: "Dozen",
      plural: "Dozens"
    },
    to_anchor: 12
  }
};
var each_default = {
  metric: metric2,
  imperial: {},
  _anchors: {
    metric: {
      unit: "ea",
      ratio: 1
    }
  }
};

// src/lib/units/definitions/energy.js
var energy;
energy = {
  Wh: {
    name: {
      singular: "Watt-hour",
      plural: "Watt-hours"
    },
    to_anchor: 3600
  },
  mWh: {
    name: {
      singular: "Milliwatt-hour",
      plural: "Milliwatt-hours"
    },
    to_anchor: 3.6
  },
  kWh: {
    name: {
      singular: "Kilowatt-hour",
      plural: "Kilowatt-hours"
    },
    to_anchor: 3600000
  },
  MWh: {
    name: {
      singular: "Megawatt-hour",
      plural: "Megawatt-hours"
    },
    to_anchor: 3600000000
  },
  GWh: {
    name: {
      singular: "Gigawatt-hour",
      plural: "Gigawatt-hours"
    },
    to_anchor: 3600000000000
  },
  J: {
    name: {
      singular: "Joule",
      plural: "Joules"
    },
    to_anchor: 1
  },
  kJ: {
    name: {
      singular: "Kilojoule",
      plural: "Kilojoules"
    },
    to_anchor: 1000
  }
};
var energy_default = {
  metric: energy,
  _anchors: {
    metric: {
      unit: "J",
      ratio: 1
    }
  }
};

// src/lib/units/definitions/frequency.js
var frequency;
frequency = {
  mHz: {
    name: {
      singular: "millihertz",
      plural: "millihertz"
    },
    to_anchor: 1 / 1000
  },
  Hz: {
    name: {
      singular: "hertz",
      plural: "hertz"
    },
    to_anchor: 1
  },
  kHz: {
    name: {
      singular: "kilohertz",
      plural: "kilohertz"
    },
    to_anchor: 1000
  },
  MHz: {
    name: {
      singular: "megahertz",
      plural: "megahertz"
    },
    to_anchor: 1000 * 1000
  },
  GHz: {
    name: {
      singular: "gigahertz",
      plural: "gigahertz"
    },
    to_anchor: 1000 * 1000 * 1000
  },
  THz: {
    name: {
      singular: "terahertz",
      plural: "terahertz"
    },
    to_anchor: 1000 * 1000 * 1000 * 1000
  },
  rpm: {
    name: {
      singular: "rotation per minute",
      plural: "rotations per minute"
    },
    to_anchor: 1 / 60
  },
  "deg/s": {
    name: {
      singular: "degree per second",
      plural: "degrees per second"
    },
    to_anchor: 1 / 360
  },
  "rad/s": {
    name: {
      singular: "radian per second",
      plural: "radians per second"
    },
    to_anchor: 1 / (Math.PI * 2)
  }
};
var frequency_default = {
  metric: frequency,
  _anchors: {
    frequency: {
      unit: "hz",
      ratio: 1
    }
  }
};

// src/lib/units/definitions/illuminance.js
var metric3;
var imperial2;
metric3 = {
  lx: {
    name: {
      singular: "Lux",
      plural: "Lux"
    },
    to_anchor: 1
  }
};
imperial2 = {
  "ft-cd": {
    name: {
      singular: "Foot-candle",
      plural: "Foot-candles"
    },
    to_anchor: 1
  }
};
var illuminance_default = {
  metric: metric3,
  imperial: imperial2,
  _anchors: {
    metric: {
      unit: "lx",
      ratio: 1 / 10.76391
    },
    imperial: {
      unit: "ft-cd",
      ratio: 10.76391
    }
  }
};

// src/lib/units/definitions/length.js
var metric4;
var imperial3;
metric4 = {
  mm: {
    name: {
      singular: "Millimeter",
      plural: "Millimeters"
    },
    to_anchor: 1 / 1000
  },
  cm: {
    name: {
      singular: "Centimeter",
      plural: "Centimeters"
    },
    to_anchor: 1 / 100
  },
  m: {
    name: {
      singular: "Meter",
      plural: "Meters"
    },
    to_anchor: 1
  },
  km: {
    name: {
      singular: "Kilometer",
      plural: "Kilometers"
    },
    to_anchor: 1000
  }
};
imperial3 = {
  in: {
    name: {
      singular: "Inch",
      plural: "Inches"
    },
    to_anchor: 1 / 12
  },
  yd: {
    name: {
      singular: "Yard",
      plural: "Yards"
    },
    to_anchor: 3
  },
  "ft-us": {
    name: {
      singular: "US Survey Foot",
      plural: "US Survey Feet"
    },
    to_anchor: 1.000002
  },
  ft: {
    name: {
      singular: "Foot",
      plural: "Feet"
    },
    to_anchor: 1
  },
  mi: {
    name: {
      singular: "Mile",
      plural: "Miles"
    },
    to_anchor: 5280
  }
};
var length_default = {
  metric: metric4,
  imperial: imperial3,
  _anchors: {
    metric: {
      unit: "m",
      ratio: 3.28084
    },
    imperial: {
      unit: "ft",
      ratio: 1 / 3.28084
    }
  }
};

// src/lib/units/definitions/mass.js
var metric5;
var imperial4;
metric5 = {
  mcg: {
    name: {
      singular: "Microgram",
      plural: "Micrograms"
    },
    to_anchor: 1 / 1e6
  },
  mg: {
    name: {
      singular: "Milligram",
      plural: "Milligrams"
    },
    to_anchor: 1 / 1000
  },
  g: {
    name: {
      singular: "Gram",
      plural: "Grams"
    },
    to_anchor: 1
  },
  kg: {
    name: {
      singular: "Kilogram",
      plural: "Kilograms"
    },
    to_anchor: 1000
  },
  mt: {
    name: {
      singular: "Metric Tonne",
      plural: "Metric Tonnes"
    },
    to_anchor: 1e6
  }
};
imperial4 = {
  oz: {
    name: {
      singular: "Ounce",
      plural: "Ounces"
    },
    to_anchor: 1 / 16
  },
  lb: {
    name: {
      singular: "Pound",
      plural: "Pounds"
    },
    to_anchor: 1
  },
  t: {
    name: {
      singular: "Ton",
      plural: "Tons"
    },
    to_anchor: 2000
  }
};
var mass_default = {
  metric: metric5,
  imperial: imperial4,
  _anchors: {
    metric: {
      unit: "g",
      ratio: 1 / 453.592
    },
    imperial: {
      unit: "lb",
      ratio: 453.592
    }
  }
};

// src/lib/units/definitions/pace.js
var metric6;
var imperial5;
metric6 = {
  "min/km": {
    name: {
      singular: "Minute per kilometre",
      plural: "Minutes per kilometre"
    },
    to_anchor: 0.06
  },
  "s/m": {
    name: {
      singular: "Second per metre",
      plural: "Seconds per metre"
    },
    to_anchor: 1
  }
};
imperial5 = {
  "min/mi": {
    name: {
      singular: "Minute per mile",
      plural: "Minutes per mile"
    },
    to_anchor: 0.0113636
  },
  "s/ft": {
    name: {
      singular: "Second per foot",
      plural: "Seconds per foot"
    },
    to_anchor: 1
  }
};
var pace_default = {
  metric: metric6,
  imperial: imperial5,
  _anchors: {
    metric: {
      unit: "s/m",
      ratio: 0.3048
    },
    imperial: {
      unit: "s/ft",
      ratio: 1 / 0.3048
    }
  }
};

// src/lib/units/definitions/partsPer.js
var metric7;
metric7 = {
  ppm: {
    name: {
      singular: "Part-per Million",
      plural: "Parts-per Million"
    },
    to_anchor: 1
  },
  ppb: {
    name: {
      singular: "Part-per Billion",
      plural: "Parts-per Billion"
    },
    to_anchor: 0.001
  },
  ppt: {
    name: {
      singular: "Part-per Trillion",
      plural: "Parts-per Trillion"
    },
    to_anchor: 0.000001
  },
  ppq: {
    name: {
      singular: "Part-per Quadrillion",
      plural: "Parts-per Quadrillion"
    },
    to_anchor: 0.000000001
  }
};
var partsPer_default = {
  metric: metric7,
  imperial: {},
  _anchors: {
    metric: {
      unit: "ppm",
      ratio: 0.000001
    }
  }
};

// src/lib/units/definitions/power.js
var power;
power = {
  W: {
    name: {
      singular: "Watt",
      plural: "Watts"
    },
    to_anchor: 1
  },
  mW: {
    name: {
      singular: "Milliwatt",
      plural: "Milliwatts"
    },
    to_anchor: 0.001
  },
  kW: {
    name: {
      singular: "Kilowatt",
      plural: "Kilowatts"
    },
    to_anchor: 1000
  },
  MW: {
    name: {
      singular: "Megawatt",
      plural: "Megawatts"
    },
    to_anchor: 1e6
  },
  GW: {
    name: {
      singular: "Gigawatt",
      plural: "Gigawatts"
    },
    to_anchor: 1e9
  }
};
var power_default = {
  metric: power,
  _anchors: {
    metric: {
      unit: "W",
      ratio: 1
    }
  }
};

// src/lib/units/definitions/pressure.js
var metric8;
var imperial6;
metric8 = {
  Pa: {
    name: {
      singular: "pascal",
      plural: "pascals"
    },
    to_anchor: 1 / 1000
  },
  kPa: {
    name: {
      singular: "kilopascal",
      plural: "kilopascals"
    },
    to_anchor: 1
  },
  MPa: {
    name: {
      singular: "megapascal",
      plural: "megapascals"
    },
    to_anchor: 1000
  },
  hPa: {
    name: {
      singular: "hectopascal",
      plural: "hectopascals"
    },
    to_anchor: 1 / 10
  },
  bar: {
    name: {
      singular: "bar",
      plural: "bar"
    },
    to_anchor: 100
  },
  torr: {
    name: {
      singular: "torr",
      plural: "torr"
    },
    to_anchor: 101325 / 760000
  }
};
imperial6 = {
  psi: {
    name: {
      singular: "pound per square inch",
      plural: "pounds per square inch"
    },
    to_anchor: 1 / 1000
  },
  ksi: {
    name: {
      singular: "kilopound per square inch",
      plural: "kilopound per square inch"
    },
    to_anchor: 1
  }
};
var pressure_default = {
  metric: metric8,
  imperial: imperial6,
  _anchors: {
    metric: {
      unit: "kPa",
      ratio: 0.00014503768078
    },
    imperial: {
      unit: "psi",
      ratio: 1 / 0.00014503768078
    }
  }
};

// src/lib/units/definitions/reactiveEnergy.js
var reactiveEnergy;
reactiveEnergy = {
  VARh: {
    name: {
      singular: "Volt-Ampere Reactive Hour",
      plural: "Volt-Amperes Reactive Hour"
    },
    to_anchor: 1
  },
  mVARh: {
    name: {
      singular: "Millivolt-Ampere Reactive Hour",
      plural: "Millivolt-Amperes Reactive Hour"
    },
    to_anchor: 0.001
  },
  kVARh: {
    name: {
      singular: "Kilovolt-Ampere Reactive Hour",
      plural: "Kilovolt-Amperes Reactive Hour"
    },
    to_anchor: 1000
  },
  MVARh: {
    name: {
      singular: "Megavolt-Ampere Reactive Hour",
      plural: "Megavolt-Amperes Reactive Hour"
    },
    to_anchor: 1e6
  },
  GVARh: {
    name: {
      singular: "Gigavolt-Ampere Reactive Hour",
      plural: "Gigavolt-Amperes Reactive Hour"
    },
    to_anchor: 1e9
  }
};
var reactiveEnergy_default = {
  metric: reactiveEnergy,
  _anchors: {
    metric: {
      unit: "VARh",
      ratio: 1
    }
  }
};

// src/lib/units/definitions/reactivePower.js
var reactivePower;
reactivePower = {
  VAR: {
    name: {
      singular: "Volt-Ampere Reactive",
      plural: "Volt-Amperes Reactive"
    },
    to_anchor: 1
  },
  mVAR: {
    name: {
      singular: "Millivolt-Ampere Reactive",
      plural: "Millivolt-Amperes Reactive"
    },
    to_anchor: 0.001
  },
  kVAR: {
    name: {
      singular: "Kilovolt-Ampere Reactive",
      plural: "Kilovolt-Amperes Reactive"
    },
    to_anchor: 1000
  },
  MVAR: {
    name: {
      singular: "Megavolt-Ampere Reactive",
      plural: "Megavolt-Amperes Reactive"
    },
    to_anchor: 1e6
  },
  GVAR: {
    name: {
      singular: "Gigavolt-Ampere Reactive",
      plural: "Gigavolt-Amperes Reactive"
    },
    to_anchor: 1e9
  }
};
var reactivePower_default = {
  metric: reactivePower,
  _anchors: {
    metric: {
      unit: "VAR",
      ratio: 1
    }
  }
};

// src/lib/units/definitions/speed.js
var metric9;
var imperial7;
metric9 = {
  "m/s": {
    name: {
      singular: "Metre per second",
      plural: "Metres per second"
    },
    to_anchor: 3.6
  },
  "km/h": {
    name: {
      singular: "Kilometre per hour",
      plural: "Kilometres per hour"
    },
    to_anchor: 1
  }
};
imperial7 = {
  "m/h": {
    name: {
      singular: "Mile per hour",
      plural: "Miles per hour"
    },
    to_anchor: 1
  },
  knot: {
    name: {
      singular: "Knot",
      plural: "Knots"
    },
    to_anchor: 1.150779
  },
  "ft/s": {
    name: {
      singular: "Foot per second",
      plural: "Feet per second"
    },
    to_anchor: 0.681818
  }
};
var speed_default = {
  metric: metric9,
  imperial: imperial7,
  _anchors: {
    metric: {
      unit: "km/h",
      ratio: 1 / 1.609344
    },
    imperial: {
      unit: "m/h",
      ratio: 1.609344
    }
  }
};

// src/lib/units/definitions/temperature.js
var metric10;
var imperial8;
metric10 = {
  C: {
    name: {
      singular: "degree Celsius",
      plural: "degrees Celsius"
    },
    to_anchor: 1,
    anchor_shift: 0
  },
  K: {
    name: {
      singular: "degree Kelvin",
      plural: "degrees Kelvin"
    },
    to_anchor: 1,
    anchor_shift: 273.15
  }
};
imperial8 = {
  F: {
    name: {
      singular: "degree Fahrenheit",
      plural: "degrees Fahrenheit"
    },
    to_anchor: 1
  },
  R: {
    name: {
      singular: "degree Rankine",
      plural: "degrees Rankine"
    },
    to_anchor: 1,
    anchor_shift: 459.67
  }
};
var temperature_default = {
  metric: metric10,
  imperial: imperial8,
  _anchors: {
    metric: {
      unit: "C",
      transform(C) {
        return C / (5 / 9) + 32;
      }
    },
    imperial: {
      unit: "F",
      transform(F) {
        return (F - 32) * (5 / 9);
      }
    }
  }
};

// src/lib/units/definitions/time.js
var time;
var daysInYear = 365.25;
time = {
  ns: {
    name: {
      singular: "Nanosecond",
      plural: "Nanoseconds"
    },
    to_anchor: 1 / 1e9
  },
  mu: {
    name: {
      singular: "Microsecond",
      plural: "Microseconds"
    },
    to_anchor: 1 / 1e6
  },
  ms: {
    name: {
      singular: "Millisecond",
      plural: "Milliseconds"
    },
    to_anchor: 1 / 1000
  },
  s: {
    name: {
      singular: "Second",
      plural: "Seconds"
    },
    to_anchor: 1
  },
  min: {
    name: {
      singular: "Minute",
      plural: "Minutes"
    },
    to_anchor: 60
  },
  h: {
    name: {
      singular: "Hour",
      plural: "Hours"
    },
    to_anchor: 60 * 60
  },
  d: {
    name: {
      singular: "Day",
      plural: "Days"
    },
    to_anchor: 60 * 60 * 24
  },
  week: {
    name: {
      singular: "Week",
      plural: "Weeks"
    },
    to_anchor: 60 * 60 * 24 * 7
  },
  month: {
    name: {
      singular: "Month",
      plural: "Months"
    },
    to_anchor: 60 * 60 * 24 * daysInYear / 12
  },
  year: {
    name: {
      singular: "Year",
      plural: "Years"
    },
    to_anchor: 60 * 60 * 24 * daysInYear
  }
};
var time_default = {
  metric: time,
  _anchors: {
    metric: {
      unit: "s",
      ratio: 1
    }
  }
};

// src/lib/units/definitions/voltage.js
var voltage;
voltage = {
  V: {
    name: {
      singular: "Volt",
      plural: "Volts"
    },
    to_anchor: 1
  },
  mV: {
    name: {
      singular: "Millivolt",
      plural: "Millivolts"
    },
    to_anchor: 0.001
  },
  kV: {
    name: {
      singular: "Kilovolt",
      plural: "Kilovolts"
    },
    to_anchor: 1000
  }
};
var voltage_default = {
  metric: voltage,
  _anchors: {
    metric: {
      unit: "V",
      ratio: 1
    }
  }
};

// src/lib/units/definitions/volume.js
var metric11;
var imperial9;
metric11 = {
  mm3: {
    name: {
      singular: "Cubic Millimeter",
      plural: "Cubic Millimeters"
    },
    to_anchor: 1 / 1e6
  },
  cm3: {
    name: {
      singular: "Cubic Centimeter",
      plural: "Cubic Centimeters"
    },
    to_anchor: 1 / 1000
  },
  ml: {
    name: {
      singular: "Millilitre",
      plural: "Millilitres"
    },
    to_anchor: 1 / 1000
  },
  cl: {
    name: {
      singular: "Centilitre",
      plural: "Centilitres"
    },
    to_anchor: 1 / 100
  },
  dl: {
    name: {
      singular: "Decilitre",
      plural: "Decilitres"
    },
    to_anchor: 1 / 10
  },
  l: {
    name: {
      singular: "Litre",
      plural: "Litres"
    },
    to_anchor: 1
  },
  kl: {
    name: {
      singular: "Kilolitre",
      plural: "Kilolitres"
    },
    to_anchor: 1000
  },
  m3: {
    name: {
      singular: "Cubic meter",
      plural: "Cubic meters"
    },
    to_anchor: 1000
  },
  km3: {
    name: {
      singular: "Cubic kilometer",
      plural: "Cubic kilometers"
    },
    to_anchor: 1000000000000
  },
  krm: {
    name: {
      singular: "Matsked",
      plural: "Matskedar"
    },
    to_anchor: 1 / 1000
  },
  tsk: {
    name: {
      singular: "Tesked",
      plural: "Teskedar"
    },
    to_anchor: 5 / 1000
  },
  msk: {
    name: {
      singular: "Matsked",
      plural: "Matskedar"
    },
    to_anchor: 15 / 1000
  },
  kkp: {
    name: {
      singular: "Kaffekopp",
      plural: "Kaffekoppar"
    },
    to_anchor: 150 / 1000
  },
  glas: {
    name: {
      singular: "Glas",
      plural: "Glas"
    },
    to_anchor: 200 / 1000
  },
  kanna: {
    name: {
      singular: "Kanna",
      plural: "Kannor"
    },
    to_anchor: 2.617
  }
};
imperial9 = {
  tsp: {
    name: {
      singular: "Teaspoon",
      plural: "Teaspoons"
    },
    to_anchor: 1 / 6
  },
  Tbs: {
    name: {
      singular: "Tablespoon",
      plural: "Tablespoons"
    },
    to_anchor: 1 / 2
  },
  in3: {
    name: {
      singular: "Cubic inch",
      plural: "Cubic inches"
    },
    to_anchor: 0.55411
  },
  "fl-oz": {
    name: {
      singular: "Fluid Ounce",
      plural: "Fluid Ounces"
    },
    to_anchor: 1
  },
  cup: {
    name: {
      singular: "Cup",
      plural: "Cups"
    },
    to_anchor: 8
  },
  pnt: {
    name: {
      singular: "Pint",
      plural: "Pints"
    },
    to_anchor: 16
  },
  qt: {
    name: {
      singular: "Quart",
      plural: "Quarts"
    },
    to_anchor: 32
  },
  gal: {
    name: {
      singular: "Gallon",
      plural: "Gallons"
    },
    to_anchor: 128
  },
  ft3: {
    name: {
      singular: "Cubic foot",
      plural: "Cubic feet"
    },
    to_anchor: 957.506
  },
  yd3: {
    name: {
      singular: "Cubic yard",
      plural: "Cubic yards"
    },
    to_anchor: 25852.7
  }
};
var volume_default = {
  metric: metric11,
  imperial: imperial9,
  _anchors: {
    metric: {
      unit: "l",
      ratio: 33.8140226
    },
    imperial: {
      unit: "fl-oz",
      ratio: 1 / 33.8140226
    }
  }
};

// src/lib/units/definitions/volumeFlowRate.js
var metric12;
var imperial10;
metric12 = {
  "mm3/s": {
    name: {
      singular: "Cubic Millimeter per second",
      plural: "Cubic Millimeters per second"
    },
    to_anchor: 1 / 1e6
  },
  "cm3/s": {
    name: {
      singular: "Cubic Centimeter per second",
      plural: "Cubic Centimeters per second"
    },
    to_anchor: 1 / 1000
  },
  "ml/s": {
    name: {
      singular: "Millilitre per second",
      plural: "Millilitres per second"
    },
    to_anchor: 1 / 1000
  },
  "cl/s": {
    name: {
      singular: "Centilitre per second",
      plural: "Centilitres per second"
    },
    to_anchor: 1 / 100
  },
  "dl/s": {
    name: {
      singular: "Decilitre per second",
      plural: "Decilitres per second"
    },
    to_anchor: 1 / 10
  },
  "l/s": {
    name: {
      singular: "Litre per second",
      plural: "Litres per second"
    },
    to_anchor: 1
  },
  "l/min": {
    name: {
      singular: "Litre per minute",
      plural: "Litres per minute"
    },
    to_anchor: 1 / 60
  },
  "l/h": {
    name: {
      singular: "Litre per hour",
      plural: "Litres per hour"
    },
    to_anchor: 1 / 3600
  },
  "kl/s": {
    name: {
      singular: "Kilolitre per second",
      plural: "Kilolitres per second"
    },
    to_anchor: 1000
  },
  "kl/min": {
    name: {
      singular: "Kilolitre per minute",
      plural: "Kilolitres per minute"
    },
    to_anchor: 50 / 3
  },
  "kl/h": {
    name: {
      singular: "Kilolitre per hour",
      plural: "Kilolitres per hour"
    },
    to_anchor: 5 / 18
  },
  "m3/s": {
    name: {
      singular: "Cubic meter per second",
      plural: "Cubic meters per second"
    },
    to_anchor: 1000
  },
  "m3/min": {
    name: {
      singular: "Cubic meter per minute",
      plural: "Cubic meters per minute"
    },
    to_anchor: 50 / 3
  },
  "m3/h": {
    name: {
      singular: "Cubic meter per hour",
      plural: "Cubic meters per hour"
    },
    to_anchor: 5 / 18
  },
  "km3/s": {
    name: {
      singular: "Cubic kilometer per second",
      plural: "Cubic kilometers per second"
    },
    to_anchor: 1000000000000
  }
};
imperial10 = {
  "tsp/s": {
    name: {
      singular: "Teaspoon per second",
      plural: "Teaspoons per second"
    },
    to_anchor: 1 / 6
  },
  "Tbs/s": {
    name: {
      singular: "Tablespoon per second",
      plural: "Tablespoons per second"
    },
    to_anchor: 1 / 2
  },
  "in3/s": {
    name: {
      singular: "Cubic inch per second",
      plural: "Cubic inches per second"
    },
    to_anchor: 0.55411
  },
  "in3/min": {
    name: {
      singular: "Cubic inch per minute",
      plural: "Cubic inches per minute"
    },
    to_anchor: 0.55411 / 60
  },
  "in3/h": {
    name: {
      singular: "Cubic inch per hour",
      plural: "Cubic inches per hour"
    },
    to_anchor: 0.55411 / 3600
  },
  "fl-oz/s": {
    name: {
      singular: "Fluid Ounce per second",
      plural: "Fluid Ounces per second"
    },
    to_anchor: 1
  },
  "fl-oz/min": {
    name: {
      singular: "Fluid Ounce per minute",
      plural: "Fluid Ounces per minute"
    },
    to_anchor: 1 / 60
  },
  "fl-oz/h": {
    name: {
      singular: "Fluid Ounce per hour",
      plural: "Fluid Ounces per hour"
    },
    to_anchor: 1 / 3600
  },
  "cup/s": {
    name: {
      singular: "Cup per second",
      plural: "Cups per second"
    },
    to_anchor: 8
  },
  "pnt/s": {
    name: {
      singular: "Pint per second",
      plural: "Pints per second"
    },
    to_anchor: 16
  },
  "pnt/min": {
    name: {
      singular: "Pint per minute",
      plural: "Pints per minute"
    },
    to_anchor: 4 / 15
  },
  "pnt/h": {
    name: {
      singular: "Pint per hour",
      plural: "Pints per hour"
    },
    to_anchor: 1 / 225
  },
  "qt/s": {
    name: {
      singular: "Quart per second",
      plural: "Quarts per second"
    },
    to_anchor: 32
  },
  "gal/s": {
    name: {
      singular: "Gallon per second",
      plural: "Gallons per second"
    },
    to_anchor: 128
  },
  "gal/min": {
    name: {
      singular: "Gallon per minute",
      plural: "Gallons per minute"
    },
    to_anchor: 32 / 15
  },
  "gal/h": {
    name: {
      singular: "Gallon per hour",
      plural: "Gallons per hour"
    },
    to_anchor: 8 / 225
  },
  "ft3/s": {
    name: {
      singular: "Cubic foot per second",
      plural: "Cubic feet per second"
    },
    to_anchor: 957.506
  },
  "ft3/min": {
    name: {
      singular: "Cubic foot per minute",
      plural: "Cubic feet per minute"
    },
    to_anchor: 957.506 / 60
  },
  "ft3/h": {
    name: {
      singular: "Cubic foot per hour",
      plural: "Cubic feet per hour"
    },
    to_anchor: 957.506 / 3600
  },
  "yd3/s": {
    name: {
      singular: "Cubic yard per second",
      plural: "Cubic yards per second"
    },
    to_anchor: 25852.7
  },
  "yd3/min": {
    name: {
      singular: "Cubic yard per minute",
      plural: "Cubic yards per minute"
    },
    to_anchor: 25852.7 / 60
  },
  "yd3/h": {
    name: {
      singular: "Cubic yard per hour",
      plural: "Cubic yards per hour"
    },
    to_anchor: 25852.7 / 3600
  }
};
var volumeFlowRate_default = {
  metric: metric12,
  imperial: imperial10,
  _anchors: {
    metric: {
      unit: "l/s",
      ratio: 33.8140227
    },
    imperial: {
      unit: "fl-oz/s",
      ratio: 1 / 33.8140227
    }
  }
};

// src/lib/units/index.js
var measures = {
  length: length_default,
  area: area_default,
  mass: mass_default,
  volume: volume_default,
  each: each_default,
  temperature: temperature_default,
  time: time_default,
  digital: digital_default,
  partsPer: partsPer_default,
  speed: speed_default,
  pace: pace_default,
  pressure: pressure_default,
  current: current_default,
  voltage: voltage_default,
  power: power_default,
  reactivePower: reactivePower_default,
  apparentPower: apparentPower_default,
  energy: energy_default,
  reactiveEnergy: reactiveEnergy_default,
  volumeFlowRate: volumeFlowRate_default,
  illuminance: illuminance_default,
  frequency: frequency_default,
  angle: angle_default
};

class Converter {
  constructor(numerator, denominator) {
    this.val = denominator ? numerator / denominator : numerator;
    this.origin = null;
    this.destination = null;
  }
  from(from) {
    if (this.destination) {
      throw new Error(".from must be called before .to");
    }
    this.origin = this.getUnit(from);
    if (!this.origin) {
      this.throwUnsupportedUnitError(from);
    }
    return this;
  }
  to(to) {
    if (!this.origin) {
      throw new Error(".to must be called after .from");
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
      if (typeof anchor.transform === "function") {
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
      throw new Error(".toBest must be called after .from");
    }
    const options = {
      exclude: [],
      cutOffNumber: 1,
      ...opts
    };
    let best;
    this.possibilities().forEach((possibility) => {
      const unit = this.describe(possibility);
      const isIncluded = !options.exclude.includes(possibility);
      if (isIncluded && unit.system === this.origin.system) {
        const result = this.to(possibility);
        if (!best || result >= options.cutOffNumber && result < best.val) {
          best = {
            val: result,
            unit: possibility,
            singular: unit.singular,
            plural: unit.plural
          };
        }
      }
    });
    return best;
  }
  getUnit(abbr) {
    let found = null;
    Object.keys(measures).some((measure) => {
      const systems = measures[measure];
      return Object.keys(systems).some((system) => {
        if (system === "_anchors")
          return false;
        const units = systems[system];
        return Object.keys(units).some((testAbbr) => {
          if (testAbbr !== abbr)
            return false;
          found = {
            abbr,
            measure,
            system,
            unit: units[testAbbr]
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
      plural: resp.unit.name.plural
    };
  }
  list(measure) {
    const list = [];
    Object.keys(measures).forEach((testMeasure) => {
      if (measure && measure !== testMeasure)
        return;
      const systems = measures[testMeasure];
      Object.keys(systems).forEach((system) => {
        if (system === "_anchors")
          return;
        const units = systems[system];
        Object.keys(units).forEach((abbr) => {
          const unit = units[abbr];
          list.push({
            abbr,
            measure: testMeasure,
            system,
            singular: unit.name.singular,
            plural: unit.name.plural
          });
        });
      });
    });
    return list;
  }
  throwUnsupportedUnitError(what) {
    const validUnits = [];
    Object.keys(measures).forEach((measure) => {
      const systems = measures[measure];
      Object.keys(systems).forEach((system) => {
        if (system === "_anchors")
          return;
        validUnits.push(...Object.keys(systems[system]));
      });
    });
    throw new Error(`Unsupported unit ${what}, use one of: ${validUnits.join(", ")}`);
  }
  possibilities(measure) {
    const possibilities = [];
    if (!this.origin && !measure) {
      Object.keys(measures).forEach((group) => {
        Object.keys(measures[group]).forEach((system) => {
          if (system === "_anchors")
            return;
          possibilities.push(...Object.keys(measures[group][system]));
        });
      });
      return possibilities;
    }
    const targetMeasure = measure || this.origin.measure;
    Object.keys(measures[targetMeasure]).forEach((system) => {
      if (system === "_anchors")
        return;
      possibilities.push(...Object.keys(measures[targetMeasure][system]));
    });
    return possibilities;
  }
  measures() {
    return Object.keys(measures);
  }
}
function convert(value) {
  return new Converter(value);
}

// src/lib/tree/symbols.js
var EOF = Symbol("EOF");
var EOL = Symbol("EOL");
var FFI = Symbol("FFI");
var TEXT = Symbol("TEXT");
var REF = Symbol("REF");
var CODE = Symbol("CODE");
var BOLD = Symbol("BOLD");
var ITALIC = Symbol("ITALIC");
var OL_ITEM = Symbol("OL_ITEM");
var UL_ITEM = Symbol("UL_ITEM");
var HEADING = Symbol("HEADING");
var BLOCKQUOTE = Symbol("BLOCKQUOTE");
var TABLE = Symbol("TABLE");
var OPEN = Symbol("OPEN");
var CLOSE = Symbol("CLOSE");
var COMMA = Symbol("COMMA");
var BEGIN = Symbol("BEGIN");
var DONE = Symbol("DONE");
var MINUS = Symbol("MINUS");
var PLUS = Symbol("PLUS");
var MUL = Symbol("MUL");
var DIV = Symbol("DIV");
var MOD = Symbol("MOD");
var OR = Symbol("OR");
var DOT = Symbol("DOT");
var PIPE = Symbol("PIPE");
var BLOCK = Symbol("BLOCK");
var RANGE = Symbol("RANGE");
var SPREAD = Symbol("SPREAD");
var SOME = Symbol("SOME");
var EVERY = Symbol("EVERY");
var REGEX = Symbol("REGEX");
var SYMBOL = Symbol("SYMBOL");
var DIRECTIVE = Symbol("DIRECTIVE");
var LITERAL = Symbol("LITERAL");
var NUMBER = Symbol("NUMBER");
var STRING = Symbol("STRING");
var NOT = Symbol("NOT");
var LIKE = Symbol("LIKE");
var EQUAL = Symbol("EQUAL");
var NOT_EQ = Symbol("NOT_EQ");
var EXACT_EQ = Symbol("EXACT_EQ");
var LESS = Symbol("LESS");
var LESS_EQ = Symbol("LESS_EQ");
var GREATER = Symbol("GREATER");
var GREATER_EQ = Symbol("GREATER_EQ");
var COMMENT = Symbol("COMMENT");
var COMMENT_MULTI = Symbol("COMMENT_MULTI");
var DERIVE_METHODS = [
  "If",
  "It",
  "Then",
  "Else",
  "Try",
  "Check",
  "Rescue",
  "While",
  "Do",
  "Let",
  "Match"
];
var CONTROL_TYPES = [
  "@namespace",
  "@table",
  "@if",
  "@else",
  "@ok",
  "@err",
  "@try",
  "@check",
  "@rescue",
  "@while",
  "@do",
  "@let",
  "@loop",
  "@match",
  "@import",
  "@from",
  "@module",
  "@export",
  "@template"
];
var SYMBOL_TYPES = [
  ":nil",
  ":on",
  ":off"
];

// src/lib/currency-symbols.js
var currency_symbols_default = {
  AED: "د.إ",
  AFN: "؋",
  ALL: "L",
  AMD: "դր.",
  ANG: "ƒ",
  AOA: "Kz",
  ARS: "$",
  AUD: "$",
  AWG: "ƒ",
  AZN: "₼",
  BAM: "КМ",
  BBD: "$",
  BDT: "৳",
  BGN: "лв",
  BHD: "ب.د",
  BIF: "Fr",
  BMD: "$",
  BND: "$",
  BOB: "Bs.",
  BRL: "R$ ",
  BSD: "$",
  BTC: "Ƀ",
  BTN: "Nu.",
  BWP: "P",
  BYR: "Br",
  BZD: "$",
  CAD: "$",
  CDF: "Fr",
  CHF: "Fr",
  CLF: "UF",
  CLP: "$",
  CNY: "¥",
  COP: "$",
  CRC: "₡",
  CUC: "$",
  CUP: "$",
  CVE: "$",
  CZK: "Kč",
  DJF: "Fdj",
  DKK: "kr",
  DOP: "$",
  DZD: "د.ج",
  EEK: "kr",
  EGP: "ج.م",
  ERN: "Nfk",
  ETB: "Br",
  EUR: "€",
  FJD: "$",
  FKP: "£",
  GBP: "£",
  GEL: "ლ",
  GGP: "£",
  GHS: "₵",
  GIP: "£",
  GMD: "D",
  GNF: "Fr",
  GTQ: "Q",
  GYD: "$",
  HKD: "$",
  HNL: "L",
  HRK: "kn",
  HTG: "G",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  IMP: "£",
  INR: "₹",
  IQD: "ع.د",
  IRR: "﷼",
  ISK: "kr",
  JEP: "£",
  JMD: "$",
  JOD: "د.ا",
  JPY: "¥",
  KES: "KSh",
  KGS: "som",
  KHR: "៛",
  KMF: "Fr",
  KPW: "₩",
  KRW: "₩",
  KWD: "د.ك",
  KYD: "$",
  KZT: "〒",
  LAK: "₭",
  LBP: "ل.ل",
  LKR: "₨",
  LRD: "$",
  LSL: "L",
  LTL: "Lt",
  LVL: "Ls",
  LYD: "ل.د",
  MAD: "د.م.",
  MDL: "L",
  MGA: "Ar",
  MKD: "ден",
  MMK: "K",
  MNT: "₮",
  MOP: "P",
  MRO: "UM",
  MTL: "₤",
  MUR: "₨",
  MVR: "MVR",
  MWK: "MK",
  MXN: "$",
  MYR: "RM",
  MZN: "MTn",
  NAD: "$",
  NGN: "₦",
  NIO: "C$",
  NOK: "kr",
  NPR: "₨",
  NZD: "$",
  OMR: "ر.ع.",
  PAB: "B/.",
  PEN: "S/.",
  PGK: "K",
  PHP: "₱",
  PKR: "₨",
  PLN: "zł",
  PYG: "₲",
  QAR: "ر.ق",
  RON: "L",
  RSD: "РСД",
  RUB: "р.",
  RWF: "FRw",
  SAR: "ر.س",
  SBD: "$",
  SCR: "₨",
  SDG: "£",
  SEK: "kr",
  SGD: "$",
  SHP: "£",
  SKK: "Sk",
  SLL: "Le",
  SOS: "Sh",
  SRD: "$",
  STD: "Db",
  SVC: "₡",
  SYP: "£S",
  SZL: "L",
  THB: "฿",
  TJS: "ЅМ",
  TMM: "m",
  TMT: "m",
  TND: "د.ت",
  TOP: "T$",
  TRY: "TL",
  TTD: "$",
  TWD: "$",
  TZS: "Sh",
  UAH: "₴",
  UGX: "USh",
  USD: "$",
  UYU: "$",
  UZS: "лв",
  VEF: "Bs F",
  VND: "₫",
  VUV: "Vt",
  WST: "T",
  XAF: "Fr",
  XAG: "Ag Oz",
  XAU: "Au Oz",
  XCD: "$",
  XDR: "XDR",
  XOF: "Fr",
  XPF: "Fr",
  YER: "﷼",
  ZAR: "R",
  ZMK: "ZK",
  ZMW: "ZK",
  ZWL: "Z$"
};

// src/lib/builtins.js
var convertCache = null;
var unitMappingsReady = false;
var currencyMappingsReady = false;
function getConvert() {
  if (!convertCache) {
    convertCache = new convert;
  }
  return convertCache;
}
var TIME_UNITS = [];
var CURRENCY_SYMBOLS = {};
var CURRENCY_MAPPINGS = {};
var CURRENCY_EXCHANGES = {};
var DEFAULT_MAPPINGS = {};
var DEFAULT_INFLECTIONS = {};
function ensureCurrencyMappings() {
  if (currencyMappingsReady)
    return;
  currencyMappingsReady = true;
  Object.assign(CURRENCY_SYMBOLS, currency_symbols_default);
  Object.keys(CURRENCY_SYMBOLS).forEach((key) => {
    const symbol = CURRENCY_SYMBOLS[key];
    CURRENCY_MAPPINGS[symbol] = key;
    DEFAULT_MAPPINGS[key] = key;
  });
}
function ensureDefaultMappings() {
  ensureCurrencyMappings();
  if (unitMappingsReady)
    return DEFAULT_MAPPINGS;
  unitMappingsReady = true;
  const convert2 = getConvert();
  const groups = convert2.measures();
  TIME_UNITS.push(...convert2.list("time").map((x) => x.abbr).sort());
  groups.forEach((group) => {
    convert2.list(group).forEach((unit) => {
      const abbr = unit.abbr;
      const plural = unit.plural;
      const singular = unit.singular;
      DEFAULT_MAPPINGS[abbr] = abbr;
      if (!plural.includes(" ") && singular !== plural) {
        DEFAULT_MAPPINGS[plural.toLowerCase()] = abbr;
        DEFAULT_MAPPINGS[singular.toLowerCase()] = abbr;
        DEFAULT_INFLECTIONS[abbr] = [singular.toLowerCase(), plural.toLowerCase()];
      }
    });
  });
  return DEFAULT_MAPPINGS;
}

// node_modules/somedom/dist/somedom.mjs
var a = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
var Q = new Set;

// src/lib/void-tags.js
var VOID_TAGS = new Set((a || []).map((name) => String(name).toLowerCase()));
function isVoidTag(name) {
  return VOID_TAGS.has(String(name || "").toLowerCase());
}

// src/lib/tag.js
function fail(message) {
  throw new Error(message);
}
function isPlain(value) {
  return value && Object.prototype.toString.call(value) === "[object Object]";
}
function skipSpaces(input, state) {
  while (state.i < input.length && /\s/.test(input[state.i]))
    state.i++;
}
function consumeOptionalClosingTag(input, state, name) {
  let offset = state.i;
  while (offset < input.length && /\s/.test(input[offset]))
    offset++;
  if (input[offset] !== "<" || input[offset + 1] !== "/")
    return;
  offset += 2;
  const start = offset;
  while (offset < input.length && /[A-Za-z0-9:_-]/.test(input[offset]))
    offset++;
  if (offset === start)
    return;
  const closeName = input.slice(start, offset);
  if (closeName.toLowerCase() !== String(name || "").toLowerCase())
    return;
  while (offset < input.length && /\s/.test(input[offset]))
    offset++;
  if (input[offset] !== ">")
    return;
  state.i = offset + 1;
}
function readName(input, state) {
  const start = state.i;
  while (state.i < input.length && /[A-Za-z0-9:_-]/.test(input[state.i]))
    state.i++;
  if (state.i === start)
    fail("Invalid tag name");
  return input.slice(start, state.i);
}
function readQuoted(input, state) {
  const quote = input[state.i++];
  const start = state.i;
  while (state.i < input.length && input[state.i] !== quote)
    state.i++;
  if (state.i >= input.length)
    fail("Unterminated attribute string");
  const value = input.slice(start, state.i);
  state.i++;
  return value;
}
function readUnquoted(input, state) {
  const start = state.i;
  while (state.i < input.length && !/[\s/>]/.test(input[state.i]))
    state.i++;
  return input.slice(start, state.i);
}
function parseAttrs(input, state) {
  const attrs = {};
  const spreads = [];
  while (state.i < input.length) {
    skipSpaces(input, state);
    if (input[state.i] === "/" || input[state.i] === ">")
      break;
    if (input[state.i] === "{") {
      const spreadExpr = readExpr(input, state);
      if (!spreadExpr.expr.startsWith("..."))
        fail("Only spread expressions are allowed in tag attrs");
      const source = spreadExpr.expr.slice(3).trim();
      if (!source)
        fail("Missing source after spread operator in tag attrs");
      spreads.push({ expr: source });
      continue;
    }
    const key = readName(input, state);
    skipSpaces(input, state);
    if (input[state.i] === "=") {
      state.i++;
      skipSpaces(input, state);
      if (input[state.i] === "{") {
        attrs[key] = readExpr(input, state);
      } else if (input[state.i] === '"' || input[state.i] === "'") {
        attrs[key] = readQuoted(input, state);
      } else {
        attrs[key] = readUnquoted(input, state);
      }
    } else {
      attrs[key] = true;
    }
  }
  return { attrs, spreads };
}
function parseText(input, state) {
  const start = state.i;
  while (state.i < input.length && input[state.i] !== "<" && input[state.i] !== "{")
    state.i++;
  return input.slice(start, state.i);
}
function readExpr(input, state) {
  if (input[state.i] !== "{")
    fail("Expecting `{`");
  state.i++;
  let depth = 1;
  let buffer = "";
  let inQuote = null;
  while (state.i < input.length && depth > 0) {
    const cur = input[state.i++];
    if (inQuote) {
      buffer += cur;
      if (cur === inQuote && input[state.i - 2] !== "\\")
        inQuote = null;
      continue;
    }
    if (cur === '"' || cur === "'") {
      inQuote = cur;
      buffer += cur;
      continue;
    }
    if (cur === "{") {
      depth++;
      buffer += cur;
      continue;
    }
    if (cur === "}") {
      depth--;
      if (depth > 0)
        buffer += cur;
      continue;
    }
    buffer += cur;
  }
  if (depth !== 0)
    fail("Unterminated expression in tag");
  const source = buffer.trim();
  if (source === "@render")
    fail("Missing expression after @render");
  if (source.startsWith("@render ")) {
    return { expr: source.slice(8).trim() };
  }
  return { expr: source };
}
function parseNode(input, state) {
  if (input[state.i] !== "<")
    fail("Expecting `<`");
  state.i++;
  const name = readName(input, state);
  const { attrs, spreads } = parseAttrs(input, state);
  let selfClosing = false;
  if (input[state.i] === "/") {
    selfClosing = true;
    state.i++;
  }
  if (input[state.i] !== ">")
    fail("Expecting `>`");
  state.i++;
  const node = {
    name,
    attrs,
    children: [],
    selfClosing
  };
  if (spreads.length)
    node.spreads = spreads;
  if (selfClosing)
    return node;
  if (isVoidTag(name)) {
    node.selfClosing = true;
    consumeOptionalClosingTag(input, state, name);
    return node;
  }
  while (state.i < input.length) {
    if (input[state.i] === "<" && input[state.i + 1] === "/") {
      state.i += 2;
      const closeName = readName(input, state);
      if (closeName !== name)
        fail(`Mismatched closing tag: </${closeName}>`);
      skipSpaces(input, state);
      if (input[state.i] !== ">")
        fail("Expecting `>`");
      state.i++;
      return node;
    }
    if (input[state.i] === "<") {
      node.children.push(parseNode(input, state));
      continue;
    }
    if (input[state.i] === "{") {
      node.children.push(readExpr(input, state));
      continue;
    }
    const text = parseText(input, state);
    if (text.length) {
      node.children.push(text);
    }
  }
  fail(`Missing closing tag for <${name}>`);
}
function escapeText(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(value) {
  return escapeText(value).replace(/"/g, "&quot;");
}
function parseTag(input) {
  if (!input || typeof input !== "string")
    fail("Invalid tag input");
  const source = input.trim();
  const state = { i: 0 };
  const node = parseNode(source, state);
  skipSpaces(source, state);
  if (state.i !== source.length)
    fail("Unexpected trailing content after tag");
  return node;
}
function renderTag(node) {
  if (!node || typeof node.name !== "string")
    fail("Invalid tag value");
  const attrs = Object.keys(node.attrs || {}).map((key) => {
    const value = node.attrs[key];
    if (value === true)
      return key;
    return `${key}="${escapeAttr(String(value))}"`;
  }).join(" ");
  const open = attrs.length ? `<${node.name} ${attrs}` : `<${node.name}`;
  const children = (node.children || []).map((child) => {
    if (typeof child === "string")
      return escapeText(child);
    if (typeof child === "number" || typeof child === "boolean")
      return escapeText(String(child));
    if (child && typeof child.expr === "string")
      return "";
    return renderTag(child);
  }).join("");
  if (node.selfClosing && !children.length) {
    return `${open} />`;
  }
  return `${open}>${children}</${node.name}>`;
}
function asChild(value) {
  if (value === null || typeof value === "undefined")
    return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (isPlain(value) && typeof value.name === "string")
    return value;
  return String(value);
}
function composeTag(node, args) {
  const next = {
    name: node.name,
    attrs: { ...node.attrs || {} },
    children: [...node.children || []],
    selfClosing: false
  };
  let offset = 0;
  if (args[0] && isPlain(args[0]) && !Array.isArray(args[0]) && !("name" in args[0])) {
    Object.assign(next.attrs, args[0]);
    offset = 1;
  }
  for (let i = offset;i < args.length; i++) {
    const child = asChild(args[i]);
    if (child !== null)
      next.children.push(child);
  }
  return next;
}

// src/lib/helpers.js
var LOGIC_TYPES = [LESS, LESS_EQ, GREATER, GREATER_EQ, EXACT_EQ, NOT_EQ, NOT, LIKE, EQUAL, SOME, EVERY];
var RESULT_TYPES = [NUMBER, STRING, SYMBOL, LITERAL, BLOCK, RANGE, REGEX];
var INVOKE_TYPES = [EOL, COMMA, BLOCK, RANGE, LITERAL];
var COMMENT_TYPES = [COMMENT, COMMENT_MULTI];
var MATH_TYPES = [EQUAL, MINUS, PLUS, MUL, DIV, PIPE, MOD, SOME, LIKE, NOT, OR];
var END_TYPES = [OR, EOF, EOL, COMMA, DONE, CLOSE, PIPE];
var LIST_TYPES = [BEGIN, DONE, OPEN, CLOSE];
var SCALAR_TYPES = [NUMBER, STRING];
var RE_SLICING = /^:(-?\d+)?(\.\.|-)?(?:(-?\d+))?$/;

class Token {
  constructor(type, text, value, tokenInfo) {
    const {
      line,
      col,
      kind
    } = tokenInfo || {};
    if (kind)
      this.kind = kind;
    this.value = typeof value !== "undefined" && value !== null ? value : text;
    this.type = type;
    this.line = line;
    this.col = col;
  }
  valueOf() {
    return this.value;
  }
  get isRaw() {
    return this.kind === "raw";
  }
  get isMulti() {
    return this.kind === "multi";
  }
  get isMarkup() {
    return this.kind === "markup";
  }
  static get(token, isWeak) {
    if (typeof token === "undefined")
      throw new Error("Invalid token");
    const result = !isWeak || typeof token.value === "undefined" ? token.valueOf() : token.value;
    if (isWeak && token.type === SYMBOL) {
      return result.substr(1);
    }
    return Array.isArray(result) ? result.map((x) => {
      if (x.type === LITERAL && x.value === "_")
        return LITERAL;
      return Token.get(x, isWeak);
    }) : result;
  }
}
function isSymbol(t) {
  return t && t.type === SYMBOL;
}
function isDirective(t) {
  return t && t.type === DIRECTIVE;
}
function isNumber(t) {
  return t && t.type === NUMBER;
}
function isString(t) {
  return t && t.type === STRING;
}
function isComma(t) {
  return t && t.type === COMMA;
}
function isEqual(t) {
  return t && t.type === EQUAL;
}
function isBlock(t) {
  return t && t.type === BLOCK;
}
function isRange(t) {
  return t && t.type === RANGE;
}
function isBegin(t) {
  return t && t.type === BEGIN;
}
function isSome(t) {
  return t && t.type === SOME;
}
function isEvery(t) {
  return t && t.type === EVERY;
}
function isDone(t) {
  return t && t.type === DONE;
}
function isClose(t) {
  return t && t.type === CLOSE;
}
function isOpen(t) {
  return t && t.type === OPEN;
}
function isPipe(t) {
  return t && t.type === PIPE;
}
function isText(t) {
  return t && t.type === TEXT;
}
function isCode(t) {
  return t && t.type === CODE;
}
function isDot(t) {
  return t && t.type === DOT;
}
function isMod(t) {
  return t && t.type === MOD;
}
function isNot(t) {
  return t && t.type === NOT;
}
function isRef(t) {
  return t && t.type === REF;
}
function isOR(t) {
  return t && t.type === OR;
}
function isEOF(t) {
  return t && t.type === EOF;
}
function isEOL(t) {
  return t && t.type === EOL;
}
function isInvokable(t) {
  return t && INVOKE_TYPES.includes(t.type);
}
function isComment(t) {
  return t && COMMENT_TYPES.includes(t.type);
}
function isResult(t) {
  return t && RESULT_TYPES.includes(t.type);
}
function isScalar(t) {
  return t && SCALAR_TYPES.includes(t.type);
}
function isLogic(t) {
  return t && LOGIC_TYPES.includes(t.type);
}
function isMath(t) {
  return t && MATH_TYPES.includes(t.type);
}
function isList(t) {
  return t && LIST_TYPES.includes(t.type);
}
function isEnd(t) {
  return t && END_TYPES.includes(t.type);
}
function isCall(t) {
  return t && (t.type === PIPE || t.type === BLOCK && !t.value.body && t.value.args);
}
function isMixed(t, ...o) {
  return t && t.type === LITERAL && t.value && o.includes(typeof t.value);
}
function isPlain2(t) {
  return t && Object.prototype.toString.call(t) === "[object Object]";
}
function isObject(t) {
  return t && t.type === LITERAL && (t.isObject || isMixed(t, "object"));
}
function isLiteral(t, v) {
  return t && t.type === LITERAL && (v ? t.value === v : true);
}
function isOperator(t) {
  return isLogic(t) || isMath(t);
}
function isStatement(t) {
  if (!t)
    return false;
  if (typeof t === "string")
    return CONTROL_TYPES.includes(t);
  return isDirective(t) && CONTROL_TYPES.includes(t.value);
}
function isSpecial(t) {
  return t && SYMBOL_TYPES.includes(t.value);
}
function isArray(t) {
  return t && t.type === RANGE && Array.isArray(t.value);
}
function isSlice(t) {
  return t && t.type === SYMBOL && RE_SLICING.test(t.value);
}
function isUnit(t) {
  return t && t.type === NUMBER && isPlain2(t.value);
}
function isData(t) {
  return isRange(t) && Array.isArray(t.value) || isLiteral(t) || isResult(t) && !isInvokable(t);
}
function hasStatements(o) {
  return CONTROL_TYPES.some((k) => o[k.substr(1)] && o[k.substr(1)].isStatement);
}
function hasBreaks(token) {
  if (isString(token) && typeof token.value === "string") {
    return token.value.includes(`
`);
  }
  if (isText(token)) {
    return token.value.buffer.some((x) => typeof x === "string" && x.includes(`
`));
  }
}
function hasDiff(prev, next, isWeak) {
  if (prev === LITERAL || next === LITERAL)
    return false;
  const prevValue = Token.get(prev, isWeak);
  const nextValue = Token.get(next, isWeak);
  if (prevValue instanceof RegExp || nextValue instanceof RegExp) {
    const regexp = prevValue instanceof RegExp ? prevValue : nextValue;
    const value = prevValue instanceof RegExp ? nextValue : prevValue;
    return !regexp.test(value);
  }
  if (Array.isArray(prevValue)) {
    if (isWeak) {
      prevValue.length = nextValue.length = Math.min(prevValue.length, nextValue.length);
    }
    if (prevValue.length !== nextValue.length)
      return true;
    for (let i = 0, c = prevValue.length;i < c; i++) {
      if (hasDiff(prevValue[i], nextValue[i], isWeak))
        return true;
    }
    return false;
  }
  if (isPlain2(prevValue)) {
    if (!isPlain2(nextValue))
      return true;
    const a2 = Object.keys(prevValue).sort();
    const b = Object.keys(nextValue).sort();
    if (hasDiff(a2, b, isWeak))
      return true;
    for (let i = 0;i < a2.length; i += 1) {
      if (hasDiff(prevValue[a2[i]], nextValue[b[i]], isWeak))
        return true;
    }
    return false;
  }
  if (isWeak) {
    return prevValue != nextValue;
  }
  return prevValue !== nextValue;
}
function hasIn(prev, next) {
  const prevValue = Token.get(prev, true);
  const nextValue = Token.get(next, true);
  if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
    return nextValue.every((x) => hasIn(prev, x));
  }
  if (Array.isArray(prevValue) || typeof prevValue === "string") {
    return prevValue.includes(nextValue);
  }
  if (isObject(prev)) {
    return Array.isArray(nextValue) ? nextValue.every((x) => (x in prevValue)) : (nextValue in prevValue);
  }
  return false;
}
function deindent(source) {
  const matches = source.match(/\n(\s+)/m);
  if (matches) {
    return source.split(`
`).map((line) => {
      if (line.indexOf(matches[1]) === 0) {
        return line.substr(matches[1].length);
      }
      return line;
    }).join(`
`).trim();
  }
  return source;
}
function hilight(value, colorize) {
  return value.replace(/<[^<>]*>/g, (x) => colorize(STRING, x));
}
function format(text) {
  const chunks = text.split(/([`*_]{1,2})(.+?)\1/g);
  const buffer = [];
  for (let i = 0, c = chunks.length;i < c; i++) {
    if (!chunks[i].length)
      continue;
    if (chunks[i].charAt() === "`") {
      buffer.push([CODE, chunks[i], chunks[++i]]);
    } else if ("*_".includes(chunks[i].charAt())) {
      buffer.push([chunks[i].length > 1 ? BOLD : ITALIC, chunks[i], chunks[++i]]);
    } else {
      buffer.push(chunks[i]);
    }
  }
  return buffer;
}
function copy(obj) {
  if (Array.isArray(obj)) {
    return obj.map(copy);
  }
  return obj.clone();
}
function repr(t) {
  return t.toString().match(/\((\w+)\)/)[1];
}
function raise(summary, tokenInfo, descriptor) {
  summary += tokenInfo ? ` at line ${tokenInfo.line + 1}:${tokenInfo.col + 1}` : "";
  summary += descriptor ? ` (${descriptor})` : "";
  const Err = tokenInfo ? SyntaxError : TypeError;
  const e = new Err(summary);
  e.line = tokenInfo ? tokenInfo.line : 0;
  e.col = tokenInfo ? tokenInfo.col : 0;
  e.stack = summary;
  throw e;
}
function assert(token, inherit, ...allowed) {
  if (!allowed.includes(token.type)) {
    const set = allowed.map(repr);
    const last = set.length > 1 ? set.pop() : "";
    const value = set.join(", ").toLowerCase() + (last ? ` or ${last.toLowerCase()}` : "");
    raise(`Expecting ${value} but found \`${token}\``, inherit ? token.tokenInfo : undefined);
  }
}
function check(token, value, info) {
  const actual = token instanceof Token ? token.value : token;
  const tokenInfo = token.tokenInfo || token;
  if (!value) {
    raise(`Unexpected \`${actual}\``, tokenInfo);
  }
  const suffix = ` ${info || "but found"} \`${actual}\``;
  value = typeof value === "symbol" ? repr(value).toLowerCase() : value;
  raise(`Expecting ${value}${suffix}`, tokenInfo);
}
function argv(set, token, offset) {
  if (set === null) {
    const call2 = token.value.source;
    const head2 = token.value.input[offset];
    raise(`Missing argument \`${head2}\` to call \`${call2}\``);
  }
  const call = token.source || token.value.source;
  const head = set[Math.min(offset, set.length - 1)];
  raise(`Unexpected argument \`${head}\` to call \`${call}\``);
}
function only(token, callback) {
  const source = token.getBody();
  if (source.length > 1 || !callback(source[0])) {
    check(source[1] || source[0]);
  }
}
function literal(t) {
  switch (t.type) {
    case OPEN:
      return "(";
    case CLOSE:
      return ")";
    case COMMA:
      return ",";
    case BEGIN:
      return "[";
    case DONE:
      return "]";
    case EOL:
      return ".";
    case DOT:
      return ".";
    case MINUS:
      return "-";
    case PLUS:
      return "+";
    case MOD:
      return "%";
    case MUL:
      return "*";
    case DIV:
      return "/";
    case PIPE:
      return "|>";
    case BLOCK:
      return "->";
    case RANGE:
      return "..";
    case SYMBOL:
      return ":";
    case NOT_EQ:
      return "!=";
    case SOME:
      return "?";
    case EVERY:
      return "$";
    case OR:
      return "|";
    case NOT:
      return "!";
    case LIKE:
      return "~";
    case EXACT_EQ:
      return "==";
    case EQUAL:
      return "=";
    case LESS_EQ:
      return "<=";
    case LESS:
      return "<";
    case GREATER_EQ:
      return ">=";
    case GREATER:
      return ">";
    default:
      return t.value;
  }
}
function quote(s) {
  return `"${s.replace(/"/g, "\\\"")}"`;
}
function split(s) {
  return s.split(/(?=[\W\x00-\x7F])/);
}
function slice(s) {
  const matches = s.match(RE_SLICING);
  const min = matches[1] ? parseFloat(matches[1]) : undefined;
  const max = matches[3] ? parseFloat(matches[3]) : undefined;
  if (matches[2] === "..") {
    return { begin: min, end: max };
  }
  if (min < 0 && typeof max !== "undefined")
    throw new Error(`Invalid take-step \`${s}\``);
  if (max < 0)
    throw new Error(`Invalid take-step \`${s}\``);
  return { offset: min, length: max };
}
function isDigit(c) {
  return c >= "0" && c <= "9";
}
function isReadable(c, raw) {
  return c === "#" || c === "$" || c >= "&" && c <= "'" || c >= "^" && c <= "z" || c >= "@" && c <= "Z" || raw && (c === "." || c === "-") || c.charCodeAt() > 127 && c.charCodeAt() !== 255;
}
function isAlphaNumeric(c, raw) {
  return isDigit(c) || isReadable(c, raw);
}
function getSeparator(_, o, p, c, n, dx) {
  if (isComment(p) && !isText(c) || isComment(c) && !isText(p)) {
    return (isComment(p) ? p : c).type === COMMENT_MULTI ? " " : `
`;
  }
  if (dx === "Stmt" && (!o && isBlock(p) && !isBlock(c) || isBlock(p) && isBlock(c) && !c.isStatement && c.isRaw) || isComma(p) && !isText(c) || isOperator(p) && isBlock(c) || o && isOperator(p) && (isData(c) && !isLiteral(c)) && !(isEOL(o) || isComma(o) || isText(o)) || isData(p) && isOperator(c) && isData(n) || isData(o) && isOperator(p) && isData(c) || isData(p) && !isLiteral(p) && isOperator(c) || (isBlock(p) && isOperator(c) || isBlock(o) && isOperator(p)) || isLiteral(_) && isOperator(o) && isOperator(p) && !isData(n) || isLiteral(p) && isOperator(c) && isOperator(n) && c.value !== n.value || isOperator(o) && isOperator(p) && o.value !== p.value && isLiteral(c))
    return " ";
  if (isBlock(p) && isBlock(c) || isBlock(p) && isData(c) || isData(p) && isData(c) && (!isRange(p) || !isSymbol(c)))
    return dx === "Root" || dx !== "Expr" && !isSymbol(p) ? COMMA : " ";
}
function serialize(token, shorten, colorize = (_, x) => typeof x === "undefined" ? literal({ type: _ }) : x, descriptor = "Root") {
  if (typeof token === "undefined")
    return;
  if (token === null)
    return colorize(SYMBOL, ":nil");
  if (token === true)
    return colorize(SYMBOL, ":on");
  if (token === false)
    return colorize(SYMBOL, ":off");
  if (token instanceof Date)
    return colorize(STRING, `"${token.toISOString()}"`);
  if (token instanceof RegExp)
    return colorize(STRING, `/${token.source}/${token.flags}`);
  if (typeof token === "number")
    return colorize(NUMBER, token);
  if (typeof token === "symbol")
    return colorize(SYMBOL, token.toString().match(/\((.+?)\)/)[1]);
  if (typeof token === "string")
    return colorize(LITERAL, descriptor === "Object" ? `"${token}"` : token);
  if (typeof token === "function") {
    const name = token.toString().match(/constructor\s*\(([\s\S]*?)\)|\(([\s\S]*?)\)|([\s\S]*?)(?==>)/);
    const methods = Object.keys(token).map((k) => colorize(SYMBOL, `:${k}`)).join(" ");
    const formatted = (name[3] || name[2] || name[1] || "").trim().replace(/\s+/g, " ");
    return `${colorize(LITERAL, token.name)}${colorize(OPEN, "(")}${formatted.length ? colorize(LITERAL, formatted) : ""}${colorize(CLOSE)}${methods ? `${colorize(BEGIN)}${methods}${colorize(DONE)}` : ""}`;
  }
  if (Array.isArray(token)) {
    if (descriptor === "Object") {
      return `${colorize(BEGIN)}${token.map((x) => serialize(x, shorten, colorize, descriptor)).join(`${colorize(COMMA)} `)}${colorize(DONE)}`;
    }
    let prevData = null;
    const hasText = token.some(isText);
    return token.reduce((prev, cur, i) => {
      const sep = getSeparator(prevData, token[i - 2], token[i - 1], cur, token[i + 1], descriptor);
      const result = serialize(cur, shorten, colorize, descriptor);
      if (sep && !(isEOL(cur) || isComma(cur))) {
        prev.push(![" ", `
`].includes(sep) ? `${colorize(sep)} ` : sep);
      }
      if (isEOL(cur) || isComma(cur))
        prevData = null;
      if (isData(cur))
        prevData = cur;
      prev.push(isEOL(cur) && !hasText ? `${result}
` : result);
      return prev;
    }, []).join("");
  }
  if (isComment(token) && token.type === COMMENT) {
    return colorize(COMMENT, token.value);
  }
  if (isLiteral(token)) {
    if (token.isTag) {
      if (shorten)
        return colorize(STRING, "<.../>");
      return colorize(STRING, renderTag(token.value));
    }
    if (token.cached) {
      return colorize(LITERAL, `${token.value}!`);
    }
    if (token.isFunction) {
      return colorize(LITERAL, token.value.label);
    }
    if (!token.isObject && typeof token.value === "object") {
      return serialize(token.value, shorten, colorize, "Object");
    }
    if (typeof token.value === "undefined") {
      return colorize(true, String(token.value));
    }
    return serialize(token.value, shorten, colorize, descriptor);
  }
  if (typeof token.type === "symbol") {
    if (token.isExpression) {
      return `${colorize(token.type)} ${serialize(token.value, shorten, colorize, "Expr")}`;
    }
    if (isRef(token)) {
      const chunk = token.isRaw && token.value.href || token.value.alt || token.value.href;
      return colorize(true, token.value.text.replace(chunk, colorize(token.isRaw ? REF : TEXT, chunk)));
    }
    if (isUnit(token)) {
      return colorize(NUMBER, token.value.toString());
    }
    if (isCode(token) && token.isMulti) {
      return `${colorize(true, "```")}${colorize(null, token.value)}${colorize(true, "```")}`;
    }
    if (isString(token)) {
      const qt = colorize(STRING, token.isMulti ? '"""' : '"');
      let chunk;
      if (shorten) {
        chunk = colorize(STRING, token.isMarkup ? "<.../>" : '"..."');
      } else if (Array.isArray(token.value)) {
        const subTree = token.valueOf();
        const buffer = [];
        for (let i = 0, c = subTree.length;i < c; i++) {
          const cur = subTree[i];
          const next = subTree[i + 1];
          const prev = subTree[i - 1];
          if ((!prev || prev.type === PLUS) && cur.type === OPEN && cur.value === "#{") {
            buffer.pop();
            buffer.push(colorize(null, "#{"));
            continue;
          }
          if ((!next || next.type === PLUS) && cur.type === CLOSE && cur.value === "}") {
            buffer.push(colorize(null, "}"));
            i++;
            continue;
          }
          if (isBlock(cur) && !cur.hasArgs) {
            if (prev && prev.type === PLUS)
              buffer.pop();
            cur.tokenInfo.kind = "";
            buffer.push(colorize(null, "#{"));
            buffer.push(serialize(cur, shorten, colorize, "Str"));
            buffer.push(colorize(null, "}"));
            cur.tokenInfo.kind = "raw";
            if (next && next.type === PLUS)
              i++;
            continue;
          }
          if (!isString(cur)) {
            buffer.push(serialize(cur, shorten, colorize, descriptor));
          } else {
            buffer.push(colorize(STRING, !cur.isRaw ? `"${cur.value}"` : cur.value));
          }
        }
        chunk = !token.isMarkup ? `${qt}${buffer.join("")}${qt}` : buffer.join("");
      } else {
        chunk = colorize(STRING, !token.isMarkup ? `${qt}${token.value}${qt}` : token.value);
      }
      return chunk;
    }
    if (isBlock(token)) {
      if (typeof token.value === "string")
        return colorize(BLOCK);
      let block2 = "";
      let args = "";
      const parent = token.isStatement || descriptor === "Stmt" ? "Stmt" : "Block";
      if (!token.hasSource) {
        if (token.hasArgs) {
          const renderedArgs = serialize(token.getArgs(), shorten, colorize, parent);
          if (token.hasBody && token.getArgs().length > 1) {
            args += `${colorize(OPEN)}${renderedArgs.replace(/,\s*/g, " ")}${colorize(CLOSE)}`;
          } else {
            args += renderedArgs;
          }
        }
        if (token.hasName)
          block2 += `${colorize(LITERAL, token.getName())}${args} ${colorize(EQUAL)} `;
      }
      if (token.hasBody) {
        block2 += serialize(token.getBody(), shorten, colorize, parent);
      }
      if (!block2) {
        block2 = args;
      } else if (args) {
        block2 = `${args} ${colorize(BLOCK)} ${block2}`;
      }
      if (token.hasArgs && token.getArg(0) && token.getArg(0).isExpression) {
        block2 = `${colorize(token.getArg(0).type)}`;
        if (!shorten) {
          block2 += ` ${serialize(token.getArg(0).value, shorten, colorize, "Expr")}`;
        }
      }
      return token.isRaw ? `${colorize(OPEN)}${block2}${colorize(CLOSE)}` : block2;
    }
    if (isText(token)) {
      let prefix2 = "";
      if (token.value.kind === BLOCKQUOTE) {
        prefix2 = `${colorize(BLOCKQUOTE, ">")} `;
      } else if (token.value.kind === HEADING) {
        prefix2 = `${colorize(HEADING, Array.from({ length: token.value.level + 1 }).join("#"))} `;
      } else if (token.value.kind === UL_ITEM || token.value.kind === OL_ITEM) {
        if (token.value.depth) {
          prefix2 += Array.from({ length: token.value.depth + 1 }).join("  ");
        }
        let offset = token.value.style;
        if (this && token.value.kind === OL_ITEM) {
          const key = [repr(token.value.kind), token.value.depth || 0];
          this.offsets = this.offsets || {};
          this.offsets[key] = this.offsets[key] || token.value.level;
          offset = this.offsets[key];
          this.offsets[key]++;
        }
        prefix2 += `${colorize(token.value.kind, offset + (token.value.kind === OL_ITEM ? "." : ""))} `;
      } else if (this && isText(token) && !hasBreaks(token)) {
        delete this.offsets;
      }
      return colorize(TEXT, `${prefix2}${token.value.buffer.reduce((prev, cur, idx, all) => {
        if (Array.isArray(cur)) {
          prev += colorize(cur[0], `${cur[1]}${cur[2]}${cur[1]}`);
        } else if (isOpen(cur) && cur.value === "#{") {
          prev += colorize(null, "#{");
        } else if (isClose(cur) && cur.value === "}") {
          prev += colorize(null, "}");
        } else if (isMath(cur) && cur.type === PLUS) {
          const left = all[idx - 1];
          const right = all[idx + 1];
          const isPrefixJoin = left && right && isString(left) && left.isRaw && isOpen(right) && right.value === "#{";
          const isSuffixJoin = left && right && isClose(left) && left.value === "}" && isString(right) && right.isRaw;
          if (!isPrefixJoin && !isSuffixJoin) {
            prev += serialize(cur, shorten, colorize, descriptor);
          }
        } else if (cur && cur.type) {
          prev += serialize(cur, shorten, colorize, descriptor);
        } else if (isRef(cur)) {
          prev += serialize(cur, shorten, colorize);
        } else {
          prev += hilight(cur, colorize);
        }
        return prev;
      }, "")}`);
    }
    if (isRange(token)) {
      if (typeof token.value === "string")
        return colorize(RANGE, token.value);
      if (!Array.isArray(token.value)) {
        return colorize(RANGE, `${serialize(token.value.begin, shorten, colorize)}..${serialize(token.value.end, shorten, colorize)}`);
      }
      return `${colorize(BEGIN, "[")}${!shorten ? serialize(token.value, shorten, colorize, descriptor) : colorize(RANGE, "..")}${colorize(DONE, "]")}`;
    }
    return colorize(token.type, token.value);
  }
  if (isPlain2(token) && token.__tag && token.value && typeof token.__tag.getBody === "function" && typeof token.value.getBody === "function") {
    const [tag] = token.__tag.getBody();
    const payload = token.value.getBody();
    if (isSymbol(tag) && [":ok", ":err"].includes(tag.value)) {
      const kind = tag.value.substr(1);
      if (!payload.length)
        return colorize(SYMBOL, `@${kind}`);
      return `${colorize(SYMBOL, `@${kind}`)} ${payload.length === 1 ? serialize(payload[0], shorten, colorize, descriptor) : serialize(payload, shorten, colorize, descriptor)}`;
    }
  }
  const separator = !hasStatements(token) ? `${colorize(COMMA)} ` : " ";
  if (shorten) {
    const prefix2 = hasStatements(token) ? "@" : ":";
    return Object.keys(token).map((k) => colorize(SYMBOL, `${prefix2}${k}`)).join(separator);
  }
  const prefix = hasStatements(token) ? "@" : ":";
  const block = Object.keys(token).map((k) => `${colorize(SYMBOL, `${prefix}${k}`)} ${serialize(token[k], shorten, colorize, descriptor)}`);
  return descriptor === "Object" ? `${colorize(OPEN)}${block.join(separator)}${colorize(CLOSE)}` : block.join(separator);
}

// src/lib/tree/expr.js
class Expr {
  constructor(value, tokenInfo) {
    this.type = value.type;
    this.value = value.value;
    if (value.length)
      this.length = value.length;
    if (value.source)
      this.source = value.source;
    if (value.cached) {
      Object.defineProperty(this, "cached", { value: true });
    }
    Object.defineProperty(this, "tokenInfo", {
      value: tokenInfo || (value instanceof Token ? value : null)
    });
  }
  get isFFI() {
    return this.type === FFI;
  }
  get isBlock() {
    return this.type === BLOCK;
  }
  get isRange() {
    return this.type === RANGE;
  }
  get isNumber() {
    return this.type === NUMBER;
  }
  get isString() {
    return this.type === STRING;
  }
  get isSymbol() {
    return this.type === SYMBOL;
  }
  get isScalar() {
    return this.isNumber || this.isString || this.isSymbol;
  }
  get isIterable() {
    return this.isString || this.isBlock || this.isRange;
  }
  get isObject() {
    return this instanceof Expr.Object;
  }
  get isTag() {
    return this instanceof Expr.Tag;
  }
  get isFunction() {
    return this instanceof Expr.Function;
  }
  get isLiteral() {
    return this instanceof Expr.Literal;
  }
  get isCallable() {
    return this instanceof Expr.Callable;
  }
  get isStatement() {
    return this instanceof Expr.Statement;
  }
  get isExpression() {
    return this instanceof Expr.Expression;
  }
  toString() {
    if (this.type === EOL)
      return `.
`;
    return serialize(this, true);
  }
  valueOf() {
    if (this.type === NUMBER && typeof this.value === "string") {
      return parseFloat(this.value);
    }
    if (this.value !== null) {
      return this.value.valueOf();
    }
    return this.value;
  }
  get hasName() {
    return !!this.getName();
  }
  get hasBody() {
    return !!this.value.body;
  }
  get hasArgs() {
    return !!this.value.args;
  }
  get hasInput() {
    return !!this.value.input;
  }
  get hasSource() {
    return !!(this.value.source || this.source);
  }
  get isRaw() {
    return this.tokenInfo.kind === "raw";
  }
  get isMulti() {
    return this.tokenInfo.kind === "multi";
  }
  get isMarkup() {
    return this.tokenInfo.kind === "markup";
  }
  get isOptional() {
    return this.value.charAt(this.value.length - 1) === "?";
  }
  getBody() {
    return this.value.body;
  }
  getArgs() {
    return this.value.args;
  }
  getInput() {
    return this.value.input;
  }
  getArg(n) {
    return this.value.args[n];
  }
  getName() {
    return this.value.source || this.source || this.value.name;
  }
  push(...v) {
    return this.value.body.push(...v);
  }
  head() {
    return this.value.body[0];
  }
  get() {
    return Token.get(this);
  }
  clone() {
    if (Array.isArray(this.value)) {
      return new this.constructor({ type: this.type, value: copy(this.value) }, this.tokenInfo);
    }
    if (this.isStatement) {
      return new this.constructor({ type: BLOCK, value: { body: copy(this.getBody()) } }, this.tokenInfo);
    }
    if (this.isLiteral && isBlock(this)) {
      const newBlock = !this.hasBody ? Expr.from(BLOCK, { args: copy(this.getArgs()) }, this.tokenInfo) : Expr.from(BLOCK, { body: copy(this.getBody()) }, this.tokenInfo);
      if (this.isRaw)
        newBlock.tokenInfo.kind = "raw";
      return newBlock;
    }
    if (this.isObject) {
      return Expr.map(Object.keys(this.value).reduce((prev, cur) => {
        prev[cur] = copy(this.value[cur]);
        return prev;
      }, {}), this.tokenInfo);
    }
    if (this.isCallable) {
      return Expr.callable({
        type: BLOCK,
        value: {
          ...this.value,
          body: copy(this.getBody())
        }
      }, this.tokenInfo);
    }
    return this;
  }
  static sub(body, params) {
    if (Array.isArray(body)) {
      const self2 = body.slice();
      for (let i = 0, c = self2.length;i < c; i++) {
        if (self2[i].isCallable && params[self2[i].value.name]) {
          const fixedBody = params[self2[i].value.name].slice();
          const fixedName = fixedBody.pop();
          self2[i].value.name = fixedName.value;
          self2[i].value.body = Expr.sub(self2[i].value.body, params);
          self2.splice(i - 1, 0, ...fixedBody);
        } else if (isLiteral(self2[i]) && typeof self2[i].value === "string") {
          if (!params[self2[i].value])
            continue;
          c += params[self2[i].value].length - 1;
          self2.splice(i, 1, ...params[self2[i].value]);
        } else {
          self2[i] = Expr.sub(self2[i], params);
        }
      }
      return self2;
    }
    if (Array.isArray(body.value)) {
      body.value = Expr.sub(body.value, params);
    } else if (body.isObject) {
      Object.keys(body.value).forEach((k) => {
        body.value[k].value.body = Expr.sub(body.value[k].value.body, params);
      });
    } else if (isBlock(body)) {
      if (body.value.args)
        body.value.args = Expr.sub(body.getArgs(), params);
      if (body.value.body)
        body.value.body = Expr.sub(body.getBody(), params);
    }
    return body;
  }
  static mix(tpl, ...others) {
    return Expr.sub(copy(tpl.body), tpl.args.reduce((prev, cur, i) => {
      prev[cur.value] = others[i];
      return prev;
    }, {}));
  }
  static cut(ast) {
    const count = ast.length;
    const left = [];
    let i = 0;
    for (;i < count; i++) {
      if (isResult(ast[i]) && isResult(left[left.length - 1]))
        break;
      left.push(ast[i]);
    }
    return left;
  }
  static has(ast, type, value) {
    return ast.some((token) => {
      if (isBlock(token) && token.hasArgs) {
        return Expr.has(token.getArgs(), type, value);
      }
      return token.type === type && token.value === value;
    });
  }
  static from(type, value, tokenInfo) {
    if (Array.isArray(type)) {
      return type.map((x) => Expr.from(x));
    }
    if (type === TEXT && typeof value === "string") {
      value = { buffer: [value] };
    }
    if (typeof value === "undefined") {
      if (typeof type === "symbol") {
        return Expr.literal({ type, value: literal({ type }) });
      }
      if (Array.isArray(type.value)) {
        type.value = Expr.from(type.value);
      }
      return type instanceof Expr ? type : Expr.literal(type);
    }
    return Expr.literal({ type, value }, tokenInfo);
  }
  static args(values) {
    const list = [];
    let stack = list;
    let key = 0;
    for (let i = 0, c = values.length;i < c; i++) {
      if (isComma(values[i])) {
        list[list.length - 1] = stack[0];
        stack = list[++key] = [];
      } else {
        stack.push(values[i]);
      }
    }
    if (stack.length === 1) {
      list[list.length - 1] = stack[0];
    }
    return list;
  }
  static text(buffer, tokenInfo) {
    const head = buffer.charAt();
    const value = {};
    let level = 0;
    let type = TEXT;
    if ("#>".includes(head)) {
      type = head === ">" ? BLOCKQUOTE : HEADING;
      if (head === "#") {
        let i = 0;
        for (;i < 5; i++) {
          if (buffer.charAt(i) === "#")
            level++;
          else
            break;
        }
        buffer = buffer.substr(i);
      } else {
        buffer = buffer.substr(1);
      }
    }
    if ("-*+".includes(head) && buffer.charAt(1) === " " || isDigit(head) && /^(\d+)\.\s/.test(buffer)) {
      const [nth, ...chunks] = buffer.split(" ");
      level = isDigit(head) ? parseFloat(nth) : 0;
      type = isDigit(head) ? OL_ITEM : UL_ITEM;
      buffer = chunks.join(" ");
    }
    if (type !== TEXT)
      value.kind = type;
    if (level > 1)
      value.level = level;
    value.buffer = format(buffer.trim());
    return Expr.literal({ type: TEXT, value }, tokenInfo);
  }
  static chunk(values, inc, fx) {
    const body = [];
    let offset = 0;
    for (let c = values.length;inc < c; inc++) {
      if (fx && isCall(body[body.length - 1]))
        break;
      if (!fx && isEnd(values[inc]))
        break;
      body.push(values[inc]);
      offset++;
    }
    return { body, offset };
  }
  static arity(callable) {
    let length = 0;
    length += callable.value.args.length;
    while (callable.hasBody && callable.head().isCallable && callable.getBody().length === 1) {
      length += callable.head().getArgs().length;
      callable = callable.head();
      break;
    }
    return length;
  }
  static cast(list, types) {
    return list.reduce((prev, cur) => {
      if (cur.isStatement) {
        prev.push(...cur.getBody().reduce((p, c) => {
          if (!isComma(c)) {
            if (c.isObject) {
              p.push(...Expr.cast([c], types));
            } else {
              if (!types.includes(c.type))
                assert(c, true, ...types);
              p.push(c);
            }
          }
          return p;
        }, []));
      } else if (cur.isObject) {
        const map = cur.valueOf();
        Object.keys(map).forEach((prop) => {
          map[prop].getBody().forEach((c) => {
            if (!types.includes(c.type))
              assert(c, true, ...types);
          });
        });
        prev.push(cur);
      } else if (!types.includes(cur.type)) {
        assert(cur, true, ...types);
      } else {
        prev.push(cur);
      }
      return prev;
    }, []);
  }
  static stmt(type, body, tokenInfo) {
    if (typeof type === "object") {
      tokenInfo = body;
      body = type;
      type = null;
    }
    const params = { type: BLOCK, value: { body } };
    if (type === "@namespace")
      return Expr.namespaceStatement(params, tokenInfo);
    if (type === "@table")
      return Expr.tableStatement(params, tokenInfo);
    if (type === "@if")
      return Expr.ifStatement(params, tokenInfo);
    if (type === "@else")
      return Expr.elseStatement(params, tokenInfo);
    if (type === "@ok")
      return Expr.okStatement(params, tokenInfo);
    if (type === "@err")
      return Expr.errStatement(params, tokenInfo);
    if (type === "@while")
      return Expr.whileStatement(params, tokenInfo);
    if (type === "@do")
      return Expr.doStatement(params, tokenInfo);
    if (type === "@let")
      return Expr.letStatement(params, tokenInfo);
    if (type === "@destructure")
      return Expr.destructureStatement(params, tokenInfo);
    if (type === "@loop")
      return Expr.loopStatement(params, tokenInfo);
    if (type === "@match")
      return Expr.matchStatement(params, tokenInfo);
    if (type === "@try")
      return Expr.tryStatement(params, tokenInfo);
    if (type === "@check")
      return Expr.checkStatement(params, tokenInfo);
    if (type === "@rescue")
      return Expr.rescueStatement(params, tokenInfo);
    if (type === "@from")
      return Expr.fromStatement(params, tokenInfo);
    if (type === "@import")
      return Expr.importStatement(params, tokenInfo);
    if (type === "@module")
      return Expr.moduleStatement(params, tokenInfo);
    if (type === "@export")
      return Expr.exportStatement(params, tokenInfo);
    if (type === "@template")
      return Expr.templateStatement(params, tokenInfo);
    return Expr.statement(params, tokenInfo);
  }
  static value(mixed, tokenInfo) {
    tokenInfo = tokenInfo || { line: 0, col: 0 };
    if (mixed === null)
      return Expr.from(LITERAL, null, tokenInfo);
    if (mixed === true)
      return Expr.from(LITERAL, true, tokenInfo);
    if (mixed === false)
      return Expr.from(LITERAL, false, tokenInfo);
    if (isPlain2(mixed) && mixed instanceof Expr.Val)
      return mixed.toToken();
    if (isPlain2(mixed) && typeof mixed.name === "string" && Array.isArray(mixed.children)) {
      return Expr.tag(mixed, tokenInfo);
    }
    if (typeof mixed === "string")
      return Expr.from(STRING, mixed, tokenInfo);
    if (typeof mixed === "number")
      return Expr.from(NUMBER, mixed.toString(), tokenInfo);
    if (mixed instanceof Expr)
      return Expr.from(mixed.type, mixed.value, mixed.tokenInfo);
    if (Array.isArray(mixed)) {
      return Expr.array(mixed.map((x) => Expr.value(x)), tokenInfo);
    }
    return Expr.from(LITERAL, mixed, tokenInfo);
  }
  static plain(mixed, callback, descriptor) {
    if (Array.isArray(mixed)) {
      return mixed.map((x) => Expr.plain(x, callback, descriptor));
    }
    if (isRange(mixed)) {
      return Expr.plain(mixed.valueOf(), callback, descriptor);
    }
    if (mixed.isObject) {
      const obj = mixed.valueOf();
      return Object.keys(obj).reduce((prev, cur) => {
        const value = obj[cur].getBody();
        const fixedValue = value.length === 1 ? value[0] : value;
        prev[cur] = Expr.plain(fixedValue, callback, descriptor);
        return prev;
      }, {});
    }
    if (mixed.isCallable) {
      return (...args) => {
        if (typeof callback === "function") {
          return callback(mixed, Expr.value(args).valueOf(), descriptor);
        }
        return [
          Expr.local(mixed.getName(), mixed.tokenInfo),
          Expr.block({ args: Expr.value(args).valueOf() }, mixed.tokenInfo)
        ];
      };
    }
    if (isSymbol(mixed) && typeof mixed.value === "string") {
      return mixed.value.substr(1);
    }
    return mixed.isFunction ? mixed.value.target : mixed.valueOf();
  }
  static each(tokens, callback) {
    const body = Expr.cast(tokens, [LITERAL]);
    const calls = [];
    body.forEach((name) => {
      if (name.isObject) {
        const obj = name.valueOf();
        Object.keys(obj).forEach((key) => {
          const [head, ...tail] = obj[key].getBody();
          if (typeof head.value !== "string")
            check(head);
          calls.push(() => callback(obj[key], key, head.valueOf()));
          tail.forEach((sub) => {
            if (typeof sub.value !== "string")
              check(sub);
            calls.push(() => callback(sub, sub.valueOf()));
          });
        });
      } else {
        if (typeof name.value !== "string")
          check(name);
        calls.push(() => callback(name, name.valueOf()));
      }
    });
    return calls.map((run) => run());
  }
  static call(obj, name, label, tokenInfo) {
    const hasProto = Object.prototype.hasOwnProperty.call(obj, "prototype");
    let target = hasProto && obj.prototype[name] || obj[name];
    if (typeof target !== "function") {
      return Expr.value(target);
    }
    if (hasProto && obj.prototype[name]) {
      target = (...args) => obj.prototype[name].call(...args);
    }
    return Expr.function({ type: LITERAL, value: { label, target } }, tokenInfo);
  }
  static fn(value, tokenInfo) {
    if (typeof value === "function") {
      const F = value;
      const isClass = F.prototype && F.constructor === Function && F.prototype.constructor === F;
      const target = (...args) => isClass ? new F(...args) : F(...args);
      Object.defineProperty(target, "name", { value: F.name });
      Object.defineProperty(target, "toString", { value: () => serialize(F) });
      Object.getOwnPropertyNames(F).forEach((key) => {
        if (!["name", "length", "prototype"].includes(key)) {
          target[key] = F[key];
        }
      });
      return Expr.value(target, tokenInfo);
    }
    return Expr.function({ type: LITERAL, value }, tokenInfo);
  }
  static map(params, tokenInfo) {
    return Expr.object({ type: LITERAL, value: params }, tokenInfo);
  }
  static tag(node, tokenInfo) {
    return Expr.markup({ type: LITERAL, value: node }, tokenInfo);
  }
  static let(params, tokenInfo) {
    return Expr.map({ let: Expr.stmt("@let", params) }, tokenInfo);
  }
  static body(values, tokenInfo) {
    return Expr.from(BLOCK, { body: values || [] }, tokenInfo);
  }
  static frac(a2, b, tokenInfo) {
    return Expr.from(NUMBER, new Expr.Frac(a2, b), tokenInfo);
  }
  static unit(num, type, tokenInfo) {
    if (typeof num === "number") {
      return Expr.from(NUMBER, { num, kind: type }, tokenInfo);
    }
    return Expr.from(NUMBER, num, type || tokenInfo);
  }
  static array(values, tokenInfo) {
    return Expr.from(RANGE, values, tokenInfo);
  }
  static local(name, tokenInfo) {
    return Expr.from(LITERAL, name, tokenInfo);
  }
  static symbol(name, optional, tokenInfo) {
    return Expr.from(SYMBOL, name + (optional ? "?" : ""), tokenInfo);
  }
  static group(values, tokenInfo) {
    return !Array.isArray(values) ? Expr.block(values, tokenInfo, true) : Expr.block({ args: values }, tokenInfo, true);
  }
  static range(begin, end, tokenInfo) {
    if (!begin.length && !end.length)
      check(tokenInfo, "values", "around");
    if (!begin.length)
      check(tokenInfo, "value", "before");
    return Expr.from(RANGE, { begin, end }, tokenInfo);
  }
  static block(params, tokenInfo, rawDefinition) {
    if (rawDefinition) {
      tokenInfo = tokenInfo || {};
      tokenInfo.kind = "raw";
    }
    return Expr.from(BLOCK, params || {}, tokenInfo);
  }
  static unsafe(target, label, raw) {
    return {
      [FFI]: true,
      target,
      label: label || `FFI/${target.name || "?"}`,
      raw: !!raw
    };
  }
  static define(type, Class) {
    Expr[Class.name.replace(/_$/, "")] = Class;
    if (!Expr[type]) {
      Expr[type] = (...args) => new Class(...args);
    }
    return Class;
  }
}
Expr.define("val", class Val {
  constructor(num, type) {
    this.num = num;
    this.kind = type;
  }
  get() {
    return this.num;
  }
  from() {
    return this;
  }
  valueOf() {
    return this.num;
  }
  toToken() {
    return Expr.unit(this);
  }
  add(num, type) {
    return this.from(this.get(type) + num, type);
  }
  sub(num, type) {
    return this.from(this.get(type) - num, type);
  }
  mul(num, type) {
    return this.from(this.get(type) * num, type);
  }
  div(num, type) {
    return this.from(this.get(type) / num, type);
  }
  mod(num, type) {
    return this.from(this.get(type) % num, type);
  }
});
Expr.define("unit", class Unit extends Expr.Val {
  constructor(num, type) {
    super(num, type);
    this.kind = type.replace(/^:/, "");
  }
  toString() {
    return `${this.num.toFixed(2).replace(/\.0+$/, "")} ${this.kind}`;
  }
  get(type) {
    return type !== this.kind ? this.to(type).num : this.num;
  }
  from(num, type) {
    if (!type) {
      this.num = num;
      return this;
    }
    return new Unit(num, type);
  }
  to(type) {
    ensureDefaultMappings();
    const newKind = type.replace(/^:/, "");
    let value;
    if (CURRENCY_SYMBOLS[this.kind] || CURRENCY_SYMBOLS[newKind]) {
      const a2 = CURRENCY_EXCHANGES[this.kind];
      const b = CURRENCY_EXCHANGES[newKind];
      if (!a2)
        throw new Error(`Unsupported ${this.kind} currency`);
      if (!b)
        throw new Error(`Unsupported ${newKind} currency`);
      value = this.num * b / a2;
    } else {
      value = convert(this.num).from(this.kind).to(newKind);
    }
    return this.from(value, newKind);
  }
  static from(num, type) {
    if (Unit.exists(type)) {
      return new Unit(num, type);
    }
  }
  static exists(type) {
    ensureDefaultMappings();
    return DEFAULT_MAPPINGS[type] || DEFAULT_MAPPINGS[type.toLowerCase()];
  }
  static convert(num, base, target) {
    return new Unit(num, base).to(target);
  }
});
Expr.define("frac", class Frac extends Expr.Val {
  valueOf() {
    return this.num / this.kind;
  }
  toString() {
    return `${this.num}/${this.kind}`;
  }
  add(other) {
    if (other instanceof Frac) {
      const num = this.num * other.kind + other.num * this.kind;
      const dem = this.kind * other.kind;
      const gcd = Frac.gcd(num, dem);
      return new Frac(num / gcd, dem / gcd);
    }
  }
  sub(other) {
    if (other instanceof Frac) {
      return new Frac(this.num, this.kind).add(new Frac(-other.num, other.kind));
    }
  }
  mul(other) {
    if (other instanceof Frac) {
      return new Frac(this.num * other.num, this.kind * other.kind);
    }
  }
  div(other) {
    if (other instanceof Frac) {
      return Frac.from(this.kind * other.num / (this.num * other.kind));
    }
  }
  mod(other) {
    if (other instanceof Frac) {
      return Frac.from(this * 100 % (other * 100) / 100);
    }
  }
  static from(num) {
    const dec = num.toString().match(/\.0+\d/);
    const length = Math.max(dec ? dec[0].length : 3, 3);
    const div = parseInt(`1${Array.from({ length }).join("0")}`, 10);
    const base = Math.floor(parseFloat(num) * div) / div;
    const [left, right] = base.toString().split(".");
    if (!right)
      return parseFloat(left);
    const a2 = parseFloat(left + right);
    const b = 10 ** right.length;
    const factor = Frac.gcd(a2, b);
    if (left < 1) {
      return new Frac(a2 / factor, b / factor);
    }
    return new Frac(b / factor, a2 / factor);
  }
  static gcd(a2, b) {
    if (!b)
      return a2;
    return Frac.gcd(b, a2 % b);
  }
});
Expr.define("object", class Object_ extends Expr {
});
Expr.define("markup", class Tag extends Expr {
});
Expr.define("literal", class Literal extends Expr {
});
Expr.define("function", class Function_ extends Expr {
});
Expr.define("callable", class Callable extends Expr {
});
Expr.define("statement", class Statement extends Expr {
});
Expr.define("expression", class Expression extends Expr {
});
Expr.define("namespaceStatement", class NamespaceStatement extends Expr.Statement {
});
Expr.define("tableStatement", class TableStatement extends Expr.Statement {
});
Expr.define("ifStatement", class IfStatement extends Expr.Statement {
});
Expr.define("elseStatement", class ElseStatement extends Expr.Statement {
});
Expr.define("okStatement", class OkStatement extends Expr.Statement {
});
Expr.define("errStatement", class ErrStatement extends Expr.Statement {
});
Expr.define("doStatement", class DoStatement extends Expr.Statement {
});
Expr.define("whileStatement", class WhileStatement extends Expr.Statement {
});
Expr.define("letStatement", class LetStatement extends Expr.Statement {
});
Expr.define("destructureStatement", class DestructureStatement extends Expr.Statement {
});
Expr.define("loopStatement", class LoopStatement extends Expr.Statement {
});
Expr.define("matchStatement", class MatchStatement extends Expr.Statement {
});
Expr.define("tryStatement", class TryStatement extends Expr.Statement {
});
Expr.define("checkStatement", class CheckStatement extends Expr.Statement {
});
Expr.define("rescueStatement", class RescueStatement extends Expr.Statement {
});
Expr.define("fromStatement", class FromStatement extends Expr.Statement {
});
Expr.define("importStatement", class ImportStatement extends Expr.Statement {
});
Expr.define("moduleStatement", class ModuleStatement extends Expr.Statement {
});
Expr.define("exportStatement", class ExportStatement extends Expr.Statement {
});
Expr.define("templateStatement", class TemplateStatement extends Expr.Statement {
});

// src/lib/prelude.js
var exports_prelude = {};
__export(exports_prelude, {
  vals: () => vals,
  take: () => take,
  tail: () => tail,
  size: () => size,
  show: () => show,
  rev: () => rev,
  repr: () => repr2,
  render: () => render,
  push: () => push,
  pairs: () => pairs,
  map: () => map,
  list: () => list,
  keys: () => keys,
  items: () => items,
  head: () => head,
  get: () => get,
  format: () => format2,
  filter: () => filter,
  equals: () => equals,
  drop: () => drop,
  check: () => check2,
  cast: () => cast
});

// src/lib/range.js
class Range {
  constructor(base, target, increment) {
    this.alpha = this.alpha || false;
    this.step = increment || 1;
    this.offset = null;
    this.length = null;
    this.max = Infinity;
    this.begin = base.valueOf();
    this.end = typeof target === "undefined" || target === null ? Infinity : target.valueOf();
    this.infinite = this.end === Infinity || this.end === -Infinity;
    if (!this.infinite && (isString(base) || isString(target))) {
      this.begin = String(this.begin).charCodeAt();
      this.end = String(this.end).charCodeAt();
      this.alpha = true;
    }
    if (!this.infinite && this.begin > this.end) {
      this.step = -1;
    }
    Object.defineProperty(this, "idx", { value: 0, writable: true });
  }
  getIterator() {
    return Range.build(this.begin, this.end, this.step, this.infinite);
  }
  toString() {
    const prefix = this.infinite ? `${this.begin}..` : [this.begin, this.end].join("..");
    let suffix = "";
    let defs = this.idx;
    if (this.max !== Infinity) {
      suffix += `:${this.max}`;
      defs--;
    }
    if (Math.abs(this.step) !== 1) {
      suffix += `:${this.step}`;
      defs--;
    }
    suffix += Array.from({ length: defs + 1 }).join(":");
    if (this.offset !== null) {
      suffix += `:${this.offset}`;
    }
    return prefix + suffix;
  }
  take(expr) {
    const {
      offset,
      length,
      begin,
      end
    } = slice(expr);
    if (expr === ":") {
      if (this.idx >= 2)
        throw new Error(`Unexpected \`:\` after \`${this}\``);
      this.idx++;
      return this;
    }
    if (typeof begin !== "undefined" && typeof end !== "undefined") {
      if (this.offset !== null || this.idx < 2)
        throw new Error(`Unexpected take-range \`:${begin}..${end}\` after \`${this}\``);
      this.offset = begin;
      this.length = end;
      this.idx += 2;
      if (begin < 0 && end < 0) {
        this.length = (begin - end) * -1;
      }
      return this;
    }
    if (typeof offset !== "undefined" && typeof length !== "undefined") {
      if (this.max !== Infinity || this.idx > 0)
        throw new Error(`Unexpected take-step \`:${offset}-${length}\` after \`${this}\``);
      this.max = offset;
      this.step = length;
      this.idx += 2;
      return this;
    }
    if (this.idx >= 2) {
      if (this.offset !== null)
        throw new Error(`Unexpected take-range \`:${offset}\` after \`${this}\``);
      this.offset = offset;
      this.max = 1;
    } else if (this.idx === 1) {
      this.step = offset;
      this.idx++;
    } else {
      this.max = offset;
      this.idx++;
    }
    return this;
  }
  run(invoke, callback) {
    return invoke ? Range.run(this, callback || ((x) => x)) : this;
  }
  static async run(gen, callback) {
    const it = gen.getIterator();
    const seq = [];
    const max = gen.infinite ? Infinity : gen.end > gen.begin ? gen.end - gen.begin : gen.begin - gen.end;
    for (let i = 0, nextValue = it.next();nextValue.done !== true; nextValue = it.next(), i++) {
      let keep = true;
      if (gen.offset !== null) {
        if (gen.offset >= 0) {
          keep = i >= gen.offset;
        } else if (gen.infinite) {
          throw new Error("Negative offsets are not supported for infinite ranges");
        } else if (gen.begin < 0) {
          keep = max - i + gen.offset < 0;
        } else {
          keep = i >= gen.offset + gen.end;
        }
      }
      if (keep) {
        const newValue = gen.alpha ? String.fromCharCode(nextValue.value) : nextValue.value;
        const fixedValue = await callback(Expr.value(newValue));
        seq.push(...!Array.isArray(fixedValue) ? [fixedValue] : fixedValue);
      }
      if (seq.length >= gen.max)
        break;
      if (gen.length !== null && seq.length >= gen.length)
        break;
    }
    return seq;
  }
  static from(begin, end, take, step, offset, length) {
    const range = new Range(begin, end, step);
    if (typeof take === "number")
      range.max = take;
    if (typeof offset === "number")
      range.offset = offset;
    if (typeof length === "number")
      range.length = length;
    return range;
  }
  static *build(begin, end, i) {
    const infinite = end === Infinity || end === -Infinity;
    let current2 = begin;
    while (true) {
      yield current2;
      if (!infinite && current2 === end)
        return;
      current2 += i;
    }
  }
  static async unwrap(result, callback, nextToken) {
    if (!Array.isArray(result)) {
      if (isString(result)) {
        return split(result.value).map((chunk) => Expr.value(chunk));
      }
      if (isNumber(result)) {
        return [new Range(Expr.value(1), result.valueOf())];
      }
      if (result.value instanceof Range) {
        if (nextToken) {
          if (nextToken.value !== ":")
            result.value.idx += 2;
          result.value.take(nextToken.value);
        }
        return result.value.run(true, callback);
      }
      return result.value;
    }
    const seq = [];
    for (let j = 0, k = result.length;j < k; j++) {
      const values = await Range.unwrap(result[j], callback, nextToken);
      for (let i = 0, c = values.length;i < c; i++) {
        let data;
        if (values[i] instanceof Range || isRange(values[i])) {
          data = await Range.run(values[i].value || values[i], callback);
        } else {
          data = await callback(values[i]);
        }
        seq.push(...data);
      }
    }
    return seq;
  }
}

// src/lib/prelude.js
var RE_PLACEHOLDER = /(?<!\{)\{([^{}]*)\}/g;
var RE_FORMATTING = /^([^:]*?)(?::(.*?[<^>](?=\d)|)(\d+|)([?bxo]|)(\.\d+|)([$^]|))?$/;
var RE_LAZY = Symbol("LAZY_SEQ");
function isRangeLike(input) {
  return input instanceof Range || input && typeof input.getIterator === "function" && typeof input.run === "function";
}
function isLazySeq(input) {
  return !!(input && input[RE_LAZY]);
}
function asRange(input) {
  if (isRangeLike(input))
    return input;
  if (input && input.value) {
    return asRange(input.value);
  }
  if (input && Array.isArray(input.begin) && Array.isArray(input.end) && input.begin.length) {
    const begin = input.begin[0];
    const end = input.end.length ? input.end[0] : undefined;
    return Range.from(begin, end);
  }
  return null;
}
function collectRange(range, limit = Infinity, offset = 0) {
  const seq = [];
  let index = 0;
  if (range.infinite && limit === Infinity) {
    raise("Infinite range requires explicit limit");
  }
  const iterator = range.getIterator();
  for (let next = iterator.next();next.done !== true; next = iterator.next(), index++) {
    if (index < offset)
      continue;
    seq.push(range.alpha ? String.fromCharCode(next.value) : next.value);
    if (seq.length >= limit)
      break;
  }
  return seq;
}
function toToken(value) {
  return value instanceof Expr ? value : Expr.value(value);
}
function fromToken(value) {
  return value instanceof Expr ? value.valueOf() : value;
}
function toLazy(input) {
  if (isLazySeq(input))
    return input;
  if (input && input.value)
    return toLazy(input.value);
  const range = asRange(input);
  if (range) {
    return {
      [RE_LAZY]: true,
      source: range,
      ops: [],
      infinite: !!range.infinite
    };
  }
  return null;
}
function appendLazy(input, op) {
  const lazy = toLazy(input);
  if (!lazy)
    return null;
  return {
    [RE_LAZY]: true,
    source: lazy.source,
    ops: lazy.ops.concat(op),
    infinite: lazy.infinite
  };
}
async function collectLazy(input, limit = Infinity, offset = 0) {
  const lazy = toLazy(input);
  if (!lazy)
    return null;
  if (lazy.infinite && limit === Infinity)
    raise("Infinite range requires explicit limit");
  let iterator;
  if (isRangeLike(lazy.source)) {
    iterator = lazy.source.getIterator();
  } else if (Array.isArray(lazy.source) || typeof lazy.source[Symbol.iterator] === "function") {
    iterator = lazy.source[Symbol.iterator]();
  } else {
    raise("Input is not iterable");
  }
  const seq = [];
  let index = 0;
  for (let next = iterator.next();next.done !== true; next = iterator.next(), index++) {
    if (index < offset)
      continue;
    let value = next.value;
    if (isRangeLike(lazy.source) && lazy.source.alpha) {
      value = String.fromCharCode(value);
    }
    let keep = true;
    let token = toToken(value);
    for (let i = 0, c = lazy.ops.length;i < c; i++) {
      const op = lazy.ops[i];
      if (op.type === "map") {
        token = toToken(await op.callback(token));
      }
      if (op.type === "filter") {
        keep = !!await op.callback(token);
        if (!keep)
          break;
      }
    }
    if (!keep)
      continue;
    seq.push(fromToken(token));
    if (seq.length >= limit)
      break;
  }
  return seq;
}
function equals(a2, b, weak) {
  if (typeof a2 === "undefined")
    raise("Missing left value");
  if (typeof b === "undefined")
    raise("Missing right value");
  return !hasDiff(a2, b, weak);
}
function items(...args) {
  return args.reduce((p, c) => p.concat(c), []);
}
function show(...args) {
  return serialize(args);
}
function render(input) {
  if (typeof input === "undefined")
    raise("No input to render");
  if (input && input.isTag) {
    return renderTag(input.value);
  }
  if (input && input.isString) {
    return input.valueOf();
  }
  return serialize(input);
}
function cast(token, target) {
  if (!token)
    raise("Missing input to cast");
  if (!target)
    raise("Missing type to cast");
  assert(target, null, SYMBOL);
  let value;
  switch (target.get()) {
    case ":number":
      value = parseFloat(token.get());
      break;
    case ":string":
      value = token.get().toString();
      break;
    default:
      raise(`Invalid cast to ${target.get()}`);
  }
  return value;
}
function repr2(token) {
  let type;
  if (token.isTag)
    type = "markup";
  else if (token.isObject)
    type = "object";
  else if (token.isFunction)
    type = "function";
  else if (token.isCallable)
    type = "definition";
  else if (token.isSymbol)
    type = "symbol";
  else if (token.isRange)
    type = "range";
  else if (token.isMarkup)
    type = "markup";
  else
    type = repr(token.type).toLowerCase();
  return Expr.symbol(`:${type}`);
}
function size(token) {
  let obj;
  if (token.isTag)
    obj = token.value.children || [];
  else if (token.isFunction)
    obj = token.valueOf().target;
  else if (token.isObject)
    obj = Object.keys(token.valueOf());
  else if (token.isScalar || token.isRange)
    obj = token.valueOf();
  else
    obj = token;
  return obj.length - (token.isSymbol ? 1 : 0);
}
function get(target, ...props) {
  const isObject2 = target.length === 1 && (target[0].isObject || target[0].isRange);
  const isArray2 = isObject2 && target[0].isRange;
  const input = isObject2 ? target[0].valueOf() : target;
  return props.reduce((prev, cur) => prev.concat(isObject2 && !isArray2 ? input[cur].getBody() : input[cur]), []);
}
function push(target, ...sources) {
  if (!target)
    raise("No target given");
  if (!(target.isObject || target.isString || target.isNumber || target.isRange))
    raise("Invalid target");
  sources.forEach((sub) => {
    if (target.isObject && sub.isObject)
      Object.assign(target.value, sub.value);
    if (target.isString)
      target.value += sub.valueOf();
    if (target.isRange) {
      if (sub.isRange)
        target.value.push(...sub.value);
      else
        target.value.push(sub);
    }
    if (target.isNumber) {
      target.value = (target.valueOf() + sub.valueOf()).toString();
    }
  });
  return target;
}
function list(input) {
  if (!input)
    raise("No input to list given");
  let data;
  const range = asRange(input);
  if (Array.isArray(input)) {
    data = input;
  } else if (range) {
    data = collectRange(range);
  } else {
    if (!input.isIterable)
      raise("Input is not iterable");
    data = input.getArgs() || input.getBody() || input.valueOf();
  }
  return data;
}
async function head(input) {
  const lazy = await collectLazy(input, 1);
  if (lazy) {
    if (!lazy.length)
      raise("head: empty list");
    return lazy[0];
  }
  const range = asRange(input);
  if (range) {
    const [first2] = collectRange(range, 1);
    if (typeof first2 === "undefined")
      raise("head: empty list");
    return first2;
  }
  const [first] = list(input);
  if (typeof first === "undefined")
    raise("head: empty list");
  return first;
}
async function tail(input) {
  const lazy = await collectLazy(input, Infinity, 1);
  if (lazy) {
    return lazy;
  }
  const range = asRange(input);
  if (range) {
    return collectRange(range, Infinity, 1);
  }
  return list(input).slice(1);
}
async function take(input, length) {
  const lazy = await collectLazy(input, length || 1);
  if (lazy) {
    return lazy;
  }
  const range = asRange(input);
  if (range) {
    return collectRange(range, length || 1);
  }
  return list(input).slice(0, length || 1);
}
async function drop(input, length, offset) {
  const lazy = toLazy(input);
  if (lazy && lazy.infinite && typeof offset === "undefined") {
    const amount = length ? length.valueOf() : 1;
    return appendLazy(input, {
      type: "filter",
      callback: (() => {
        let count = amount;
        return () => count-- <= 0;
      })()
    });
  }
  const range = asRange(input);
  if (range) {
    const max = range.infinite ? offset ? offset.valueOf() + (length ? length.valueOf() : 1) : (length ? length.valueOf() : 1) + 1 : Infinity;
    const arr2 = collectRange(range, max);
    const b2 = length ? length.valueOf() : 1;
    const a3 = offset ? offset.valueOf() : arr2.length - b2;
    arr2.splice(a3, b2);
    return arr2;
  }
  const arr = list(input);
  const b = length ? length.valueOf() : 1;
  const a2 = offset ? offset.valueOf() : arr.length - b;
  arr.splice(a2, b);
  return input;
}
async function map(input, callback) {
  if (typeof callback !== "function")
    raise("Missing map callback");
  const lazy = appendLazy(input, { type: "map", callback });
  if (lazy) {
    return lazy;
  }
  const arr = await list(input);
  const out = [];
  for (let i = 0, c = arr.length;i < c; i++) {
    out.push(fromToken(await callback(toToken(arr[i]))));
  }
  return out;
}
async function filter(input, callback) {
  if (typeof callback !== "function") {
    raise("Missing filter callback");
  }
  const lazy = appendLazy(input, { type: "filter", callback });
  if (lazy) {
    return lazy;
  }
  const arr = await list(input);
  const out = [];
  for (let i = 0, c = arr.length;i < c; i++) {
    if (await callback(toToken(arr[i]))) {
      out.push(arr[i]);
    }
  }
  return out;
}
function rev(input) {
  return list(input).reverse();
}
function pairs(input) {
  if (!input)
    raise("No input given");
  if (!(input.isRange || input.isObject))
    raise("Invalid input");
  return Object.entries(input.valueOf());
}
function keys(input) {
  return pairs(input).map(([k]) => k);
}
function vals(input) {
  return pairs(input).map((x) => x[1]);
}
async function check2(input, run) {
  if (!input || !input.length)
    raise("Missing expression to check");
  const offset = input.findIndex((x) => isSome(x) || isOR(x));
  const expr = offset > 0 ? input.slice(0, offset) : input;
  const msg = offset > 0 ? input.slice(offset + 1) : [];
  const [result] = await run(...expr);
  const passed = result && result.get() === true;
  if (!isSome(input[offset]) ? !passed : passed) {
    let debug;
    if (msg.length > 0) {
      [debug] = await run(...msg);
      debug = debug && debug.valueOf();
    }
    return `\`${serialize(expr)}\` ${debug || "did not passed"}`;
  }
}
function format2(str, ...args) {
  if (!str)
    raise("No format string given");
  if (!str.isString)
    raise("Invalid format string");
  if (!args.length)
    raise("Missing value to format");
  const data = args.reduce((p, c) => {
    if (p[p.length - 1] && (p[p.length - 1].isRange && c.isRange || p[p.length - 1].isObject && c.isObject)) {
      push(p[p.length - 1], c);
    } else
      p.push(c);
    return p;
  }, []);
  let offset = 0;
  return str.value.replace(RE_PLACEHOLDER, (_, key) => {
    if (!RE_FORMATTING.test(key))
      raise(`Invalid format \`${_}\``);
    const [
      idx,
      fill,
      width,
      type,
      precision,
      transform
    ] = key.match(RE_FORMATTING).slice(1);
    let [value] = get(data, idx || offset++);
    if (typeof value === "undefined")
      return _;
    let prefix = "";
    let suffix = "";
    if (type === "?")
      value = serialize(value);
    else if (isBlock(value))
      value = value.toString();
    else if (precision && (isUnit(value) || isNumber(value))) {
      const fix = precision.substr(1);
      if (isUnit(value)) {
        const { value: base } = value;
        if (typeof base.kind === "string") {
          value = base.num.toFixed(fix);
          value = `${value} ${base.kind}`;
        } else {
          value = `${base.num}/${base.kind}`;
        }
      } else {
        value = value.valueOf().toFixed(fix);
      }
    } else if (type === "x")
      value = value.valueOf().toString(16);
    else if (type === "o")
      value = value.valueOf().toString(8);
    else if (type === "b")
      value = value.valueOf().toString(2);
    else
      value = value.valueOf().toString();
    if (typeof fill !== "undefined" && fill.length || width > 0) {
      const separator = fill.length > 1 ? fill.substr(0, fill.length - 1) : null;
      const alignment = fill.substr(-1);
      const padding = Array.from({
        length: (parseInt(width, 10) || 0) + 1 - value.length
      }).join(separator || " ");
      if (alignment === "^") {
        prefix = padding.substr(0, padding.length / 2);
        suffix = padding.substr(padding.length / 2);
      } else if (alignment === ">")
        suffix = padding;
      else
        prefix = padding;
    }
    if (transform === "^")
      value = value.toUpperCase();
    if (transform === "$")
      value = value.toLowerCase();
    value = prefix + value + suffix;
    return value;
  });
}

// src/lib/tree/env.js
var SAFE_GLOBALS = ["Promise", "RegExp", "Object", "Array", "String", "Number", "Math", "Date", "JSON"];
var SAFE_PRELUDE = Object.keys(exports_prelude).reduce((prev, cur) => {
  prev[cur] = Expr.unsafe(exports_prelude[cur], cur, cur === "check");
  return prev;
}, {});

class Env {
  constructor(value) {
    this.locals = {};
    this.resolved = new Set;
    this.templates = {};
    this.exported = true;
    this.exportedTemplates = {};
    this.descriptor = null;
    Object.defineProperty(this, "parent", { value });
  }
  has(name, recursive) {
    return !(recursive && this.parent && !this.locals[name]) ? typeof this.locals[name] !== "undefined" : this.parent.has(name, recursive);
  }
  get(name) {
    if (this.resolved.has(name)) {
      const found = Expr.has(this.locals[name].body, LITERAL, name);
      const call = this.locals[name].body[0].isCallable;
      if (found && !call) {
        raise(`Unexpected reference to \`${name}\``);
      }
      return this.locals[name];
    }
    if (!this.locals[name]) {
      if (this.parent) {
        return this.parent.get(name);
      }
      raise(`Undeclared local \`${name}\``);
    }
    this.resolved.add(name);
    return this.locals[name];
  }
  set(name, value, noInheritance) {
    if (typeof value === "function") {
      let root = this;
      if (noInheritance !== true) {
        while (root && root.parent) {
          if (root && root.has(name))
            break;
          root = root.parent;
        }
      }
      value(root, root.locals[name]);
    } else {
      this.locals[name] = value;
    }
  }
  def(name, ...values) {
    this.set(name, { body: [].concat(values) });
  }
  defn(name, params, tokenInfo) {
    this.set(name, (root) => {
      root.set(name, { ...params, ctx: tokenInfo });
    }, true);
  }
  static up(name, label, callback, environment) {
    environment.set(name, (root, token) => {
      root.set(name, { body: [Expr.value(callback(), token.ctx || token.body[0].tokenInfo)] });
    });
  }
  static sub(args, target, environment) {
    const scope = new Env(environment);
    const list2 = Expr.args(args);
    while (target.body && target.body[0].isCallable) {
      Env.merge(list2, target.args, true, scope);
      target = target.body[0].value;
    }
    if (target.body && target.args) {
      Env.merge(list2, target.args, true, scope);
    }
    return { target, scope };
  }
  static async load(ctx, name, alias, source, environment) {
    let label = `${source.split("/").pop()}/${name}${alias ? `:${alias}` : ""}`;
    const isGlobal = SAFE_GLOBALS.includes(source);
    const shared = Object.assign({
      Prelude: SAFE_PRELUDE,
      Unit: Expr.Unit,
      Frac: Expr.Frac
    }, Env.shared);
    try {
      let env;
      if (isGlobal) {
        env = globalThis[source];
      } else if (shared[source]) {
        env = shared[source];
      } else {
        env = await Env.resolve(source, name, alias, environment);
      }
      if (!env) {
        raise(`Could not load \`${name}\``, ctx.tokenInfo);
      }
      if (env instanceof Env) {
        if (env.descriptor) {
          label = `${env.descriptor}/${label.split("/")[1]}`;
        }
        if (typeof env.exported === "object") {
          name = env.exported[name] || name;
        }
        if (!env.has(name)) {
          raise(`Local \`${name}\` not exported`);
        }
        environment.defn(alias || name, {
          body: [Expr.fn({
            env,
            label,
            target: name
          }, ctx.tokenInfo)]
        }, ctx.tokenInfo);
        return;
      }
      if (!isGlobal && typeof env[name] === "undefined") {
        if (name !== "default" || (!alias || name === alias))
          raise(`Symbol \`${name}\` not exported`);
        environment.def(alias, Expr[isPlain2(env) ? "value" : "fn"](env, ctx.tokenInfo));
        return;
      }
      let body = env[name];
      if (!Array.isArray(body) || !(body[0] instanceof Expr)) {
        body = [Expr.call(env, name, label, ctx.tokenInfo)];
      }
      if (isPlain2(env[name]) && env[name][FFI]) {
        const fixedToken = { ...ctx.tokenInfo };
        const ffi = env[name];
        if (ffi.raw) {
          fixedToken.kind = "raw";
        }
        body = [Expr.function({
          type: FFI,
          value: {
            target: ffi.target,
            label: ffi.label
          }
        }, fixedToken)];
      }
      environment.defn(alias || name, { body }, ctx.tokenInfo);
    } catch (e) {
      raise(`${e.message} (${label})`, ctx.tokenInfo);
    }
  }
  static merge(list2, values, hygiene, environment) {
    const args = Expr.args(values, true);
    for (let i = 0, c = args.length;i < c; i++) {
      if (list2.length) {
        const key = args[i].value;
        const value = key === ".." ? list2.splice(0, list2.length) : list2.shift();
        if (!hygiene || !(environment.parent && environment.parent.has(key, true))) {
          environment.def(key, Array.isArray(value) ? Expr.body(value, args[i].tokenInfo) : value);
        }
      } else
        break;
    }
  }
  static create(values, environment) {
    const scope = new Env(environment);
    Object.keys(values).forEach((key) => {
      if (!(values[key] instanceof Expr)) {
        scope.def(key, Expr.value(values[key]));
      } else {
        scope.def(key, values[key]);
      }
    });
    return scope;
  }
  static register() {
    return;
  }
  static resolve() {
    return;
  }
}

// src/lib/tree/scanner.js
class Scanner {
  constructor(source, tokenInfo) {
    this.refs = {};
    this.chars = split(source);
    this.source = source;
    this.tokens = [];
    this.chunks = [];
    this.current = null;
    this.blank = "";
    this.offset = 0;
    this.start = 0;
    this.line = 0;
    this.col = 0;
    this.afterEOL = null;
    if (tokenInfo) {
      this.line = tokenInfo.line;
      this.col = tokenInfo.col;
    }
  }
  tokenInfo(clear) {
    if (!this.current) {
      this.current = { line: this.line, col: this.col };
    }
    if (clear) {
      const info = this.current;
      delete this.current;
      return info;
    }
  }
  append(value, tokenInfo) {
    if (this.chunks.length) {
      this.chunks.push(new Token(PLUS, "+", null, tokenInfo));
    }
    if (!Array.isArray(value)) {
      if (value.indexOf("#{") === -1) {
        this.chunks.push(new Token(STRING, value, null, { ...tokenInfo, kind: "raw" }));
      } else {
        this.chunks.push(...new Scanner(quote(value), { line: 0, col: 3 }).scanTokens()[0].value);
      }
    } else {
      value.pop();
      this.chunks.push(new Token(OPEN, "#{", null, { ...value[0], kind: "raw" }));
      this.chunks.push(...value);
      this.chunks.push(new Token(CLOSE, "}", null, { ...value[value.length - 1], kind: "raw" }));
    }
  }
  appendText(char, depth) {
    if (this.blank.length) {
      const { line, col } = this.tokenInfo(true);
      let style;
      let level = 0;
      let kind = TEXT;
      if (char) {
        if (char === "#") {
          let i = 0;
          level++;
          for (;i < 4; i++) {
            if (this.blank.charAt(i) === "#")
              level++;
            else
              break;
          }
          if (this.blank.charAt(i) !== " ") {
            this.appendBuffer({ buffer: format(char + this.blank) }, line, col);
            return;
          }
          kind = HEADING;
          this.blank = this.blank.substr(level);
        } else if (char === ">") {
          kind = BLOCKQUOTE;
        } else if (isDigit(char))
          kind = OL_ITEM;
        else
          kind = UL_ITEM;
        this.blank = this.blank.replace(/^\s+/, "");
        if (isDigit(char))
          level = parseFloat(char);
        if (kind === OL_ITEM || kind === UL_ITEM)
          style = char;
      }
      const value = {
        buffer: format(this.blank)
      };
      if (level)
        value.level = level;
      if (style)
        value.style = style;
      if (depth)
        value.depth = depth;
      if (kind !== TEXT)
        value.kind = kind;
      this.appendBuffer(value, line, col);
    }
  }
  appendBuffer(value, line, col) {
    let offset = col;
    const extractInterpolationTokens = (chunk, atLine, atCol) => {
      if (chunk.indexOf("#{") === -1)
        return [chunk];
      const [token] = new Scanner(quote(chunk), { line: atLine, col: atCol }).scanTokens();
      const parts = [];
      token.value.forEach((sub, idx, all) => {
        if (sub.type === PLUS) {
          const prev = all[idx - 1];
          const next = all[idx + 1];
          const isPrefixJoin = prev && next && prev.type === STRING && prev.isRaw && next.type === OPEN && next.value === "#{";
          const isSuffixJoin = prev && next && prev.type === CLOSE && prev.value === "}" && next.type === STRING && next.isRaw;
          if (isPrefixJoin || isSuffixJoin)
            return;
        }
        if (sub.type === STRING && sub.isRaw) {
          parts.push(sub.value);
        } else {
          parts.push(sub);
        }
      });
      return parts;
    };
    value.buffer = value.buffer.reduce((prev, cur) => {
      if (typeof cur === "string" && cur.includes("[")) {
        const parts = cur.split(/(!?\[.+?\](?:\s*\[.*?\]|\(.+?\)))/g);
        parts.forEach((chunk) => {
          if (chunk.indexOf("]") !== -1) {
            const matches = chunk.match(/\[(.+?)\](?:\s*\[(.*?)\]|\((.+?)\))/);
            const [href, title] = (matches[3] || matches[2]).split(/\s+/);
            const desc = title && title.charAt() === '"' ? title.substr(1, title.length - 2) : null;
            const alt = matches[1];
            prev.push(new Token(REF, {
              image: chunk.charAt() === "!",
              text: chunk,
              href: href || alt,
              cap: desc || null,
              alt: href ? alt : null
            }, null, { line, col: offset }));
          } else {
            prev.push(...extractInterpolationTokens(chunk, line, offset));
          }
          offset += chunk.length;
        });
      } else if (Array.isArray(cur)) {
        offset += cur[2].length;
        prev.push(cur);
      } else if (typeof cur === "string") {
        prev.push(...extractInterpolationTokens(cur, line, offset));
        offset += cur.length;
      } else {
        prev.push(cur);
      }
      return prev;
    }, []);
    this.tokens.push(new Token(TEXT, value, null, { line, col }));
    this.blank = "";
  }
  scanTokens() {
    while (!this.isDone()) {
      this.start = this.offset;
      if (this.scanToken() === false)
        break;
    }
    if (!this.tokens.length) {
      raise("Missing input", this);
    }
    this.appendText();
    this.tokens.push(new Token(EOF, "", null));
    return this.tokens;
  }
  scanToken() {
    const char = this.getToken();
    if (typeof char !== "string")
      return false;
    if (char !== `
` && this.blank[this.blank.length - 1] === `
`)
      this.appendText();
    if (this.col === 1) {
      if (this.afterEOL !== 1 && char === "[" && this.parseRef(this.col))
        return;
      if (char === "-" && this.parseThematicBreak())
        return;
      if (char === "#" && this.parseBlock(char))
        return;
      if (char === ">" && this.peek() === " " && this.parseBlock(char))
        return;
      if (char === "[" && this.parseLinkLine())
        return;
      if (char === "|" && this.parseTableLine())
        return;
      if (this.afterEOL !== 1 && (isAlphaNumeric(char) && char !== "@" || char === "*") && this.parseText(char))
        return;
      if (char === "`" && char === this.peek() && char === this.peekNext() && this.parseFence(char))
        return;
    }
    if (char === '"' && char === this.peek() && char === this.peekNext() && this.parseFence(char))
      return;
    if (this.blank.length === this.col - 1 && isDigit(char)) {
      let chunk = char;
      while (isDigit(this.peek()))
        chunk += this.getToken();
      if (this.peek() === "." && this.peekNext() === " ") {
        this.parseItem(chunk);
        return;
      }
    }
    if ("-+*".includes(char) && this.blank.length === this.col - 1 && this.peekToken() === " " && this.parseItem(char))
      return;
    switch (char) {
      case "(":
        this.addToken(OPEN);
        break;
      case ")":
        this.addToken(CLOSE);
        break;
      case "{":
        this.addToken(OPEN, char, { kind: "brace" });
        break;
      case "}":
        this.addToken(CLOSE, char, { kind: "brace" });
        break;
      case ",":
        this.addToken(COMMA);
        break;
      case "[":
        this.addToken(BEGIN);
        break;
      case "]":
        this.addToken(DONE);
        break;
      case ".":
        if (this.isMatch(".")) {
          this.addToken(RANGE);
        } else if (this.peek() === `
` || this.isDone()) {
          this.addToken(EOL);
        } else {
          this.addToken(DOT);
        }
        break;
      case "-":
        if (this.isMatch(">")) {
          this.addToken(BLOCK);
        } else {
          this.addToken(MINUS);
        }
        break;
      case "+":
        this.addToken(PLUS);
        break;
      case "*":
        this.addToken(MUL);
        break;
      case "!":
        this.addToken(this.isMatch("=") ? NOT_EQ : NOT);
        break;
      case "=":
        this.addToken(this.isMatch("=") ? EXACT_EQ : EQUAL);
        break;
      case "%":
        this.addToken(MOD);
        break;
      case "~":
        this.addToken(LIKE);
        break;
      case "?":
        this.addToken(SOME);
        break;
      case "$":
        this.addToken(EVERY);
        break;
      case "|":
        this.addToken(this.isMatch(">") ? PIPE : OR);
        break;
      case ">":
        this.addToken(this.isMatch("=") ? GREATER_EQ : GREATER);
        break;
      case "<":
        if (isReadable(this.peekToken())) {
          this.parseMarkup();
        } else {
          this.addToken(this.isMatch("=") ? LESS_EQ : LESS);
        }
        break;
      case "/":
        if (this.isMatch("/")) {
          this.parseComment();
        } else if (this.isMatch("*")) {
          this.parseComment(true);
        } else if (this.peekToken() !== " ") {
          this.parseRegex();
        } else {
          this.addToken(DIV);
        }
        break;
      case " ":
      case "\r":
      case "\t":
        this.pushToken(char);
        break;
      case `
`:
        this.pushToken(char);
        this.col = 0;
        this.line++;
        if (this.afterEOL !== null)
          this.afterEOL++;
        break;
      case '"':
        this.parseString();
        break;
      case ":":
        this.parseSymbol();
        break;
      case "@":
        this.parseDirective();
        break;
      default:
        if (isDigit(char)) {
          this.parseNumber();
        } else if (isReadable(char)) {
          if (this.peek() === "." && this.peekNext() === ".") {
            this.addToken(LITERAL);
          } else {
            this.parseIdentifier();
          }
        } else {
          this.col--;
          raise(`Unexpected ${char}`, this);
        }
        break;
    }
  }
  addToken(type, literal2, tokenInfo) {
    const value = this.getCurrent();
    this.appendText();
    tokenInfo = {
      line: this.line,
      col: this.col - value.length,
      ...tokenInfo
    };
    this.tokens.push(new Token(type, value, literal2, tokenInfo));
    this.afterEOL = type === EOL ? 0 : null;
  }
  nextToken(nth = 1) {
    this.tokenInfo();
    while (nth--) {
      if (this.chars[this.offset] !== "") {
        this.col++;
        this.offset++;
      }
    }
  }
  pushToken(...chars) {
    this.blank += chars.join("");
  }
  peekToken(offset = 0) {
    return this.chars[this.offset + offset];
  }
  getToken() {
    this.nextToken();
    return this.chars[this.offset - 1];
  }
  getCurrent(chunk) {
    if (chunk) {
      return this.source.substring(this.start, this.offset).substr(-chunk.length);
    }
    return this.source.substring(this.start, this.offset);
  }
  parseIdentifier() {
    while (isAlphaNumeric(this.peek()))
      this.nextToken();
    this.addToken(LITERAL);
  }
  parseNumber() {
    let value;
    while (isDigit(this.peek()))
      this.nextToken();
    if (this.peek() === "." && isDigit(this.peekNext())) {
      this.nextToken();
      while (isDigit(this.peek()))
        this.nextToken();
    }
    if (this.peek() === "/" && isDigit(this.peekNext())) {
      let i = this.offset + 1;
      while (i < this.chars.length && isDigit(this.chars[i]))
        i++;
      if (i < this.chars.length && this.chars[i] === ".") {} else {
        this.nextToken();
        while (isDigit(this.peek()))
          this.nextToken();
        const [left, right] = this.getCurrent().split("/");
        value = new Expr.Frac(parseFloat(left), parseFloat(right));
      }
    }
    if (this.peek() === " " || isReadable(this.peek())) {
      const num = value ? value.valueOf() : this.getCurrent();
      let i = this.offset + (this.peek() === " " ? 1 : 0);
      let kind = "";
      for (let c = this.chars.length;i < c; i++) {
        if (!isReadable(this.chars[i]))
          break;
        kind += this.chars[i];
      }
      const retval = kind && Env.register(parseFloat(num), kind);
      if (isPlain2(retval)) {
        this.offset = this.start = i;
        this.addToken(NUMBER, retval);
        return;
      }
    }
    this.addToken(NUMBER, value);
  }
  parseRef(col) {
    const offset = this.offset;
    const chunks = ["[", ""];
    this.blank = chunks[0];
    while (!this.isDone() && this.peek() !== `
`) {
      const char = this.getToken();
      this.pushToken(char);
      if (chunks.length >= 4) {
        if (!(chunks[0] === "[" && chunks[2] === "]" && chunks[3] === ":"))
          break;
      } else if (char !== "]" && (isAlphaNumeric(char) || char === " ")) {
        chunks[chunks.length - 1] += char;
      } else {
        chunks.push(char);
      }
    }
    if (chunks[2] !== "]" || chunks[3] !== ":") {
      this.offset = offset;
      this.blank = "";
      this.col = col;
      return;
    }
    const matches = this.blank.match(/\[(.+?)\]:\s+(\S+)(?:\s+(\(.+?\)|".+?"|'.+?'|.+?))?/);
    const fixedHref = matches[2].charAt() === "<" && matches[2].substr(-1) === ">" ? matches[2].substr(1, matches[2].length - 2) : matches[2];
    this.refs[matches[1]] = {
      text: this.blank,
      href: fixedHref,
      alt: matches[3] ? matches[3].substr(1, matches[3].length - 2) : null
    };
    this.blank = "";
    this.addToken(REF, this.refs[matches[1]], { kind: "raw" });
    return true;
  }
  parseLine() {
    while (!this.isDone() && this.peek() !== `
`)
      this.pushToken(this.getToken());
  }
  parseThematicBreak() {
    const start = this.start;
    const lineCol = this.col - 1;
    let end = this.offset;
    while (end < this.chars.length && this.chars[end] !== `
`)
      end++;
    const line = this.source.substring(start, end).trim();
    if (!/^-{3,}$/.test(line))
      return false;
    this.appendText();
    this.offset = end;
    this.col = lineCol + (end - start);
    this.blank = "";
    return true;
  }
  parseBlock(char) {
    this.appendText();
    this.parseLine();
    this.appendText(char);
    return true;
  }
  parseLinkLine() {
    const start = this.start;
    const lineCol = this.col - 1;
    let end = this.offset;
    while (end < this.chars.length && this.chars[end] !== `
`)
      end++;
    const line = this.source.substring(start, end);
    const matches = line.match(/^\[([^\]]+)\]\(([^)]+)\)\s*$/);
    if (!matches)
      return false;
    this.offset = end;
    this.col = lineCol + line.length;
    this.appendText();
    this.tokens.push(new Token(REF, {
      image: false,
      text: line,
      href: matches[2],
      cap: null,
      alt: matches[1]
    }, null, { line: this.line, col: lineCol, kind: "raw" }));
    return true;
  }
  parseTableLine() {
    const start = this.start;
    const lineCol = this.col - 1;
    let end = this.offset;
    while (end < this.chars.length && this.chars[end] !== `
`)
      end++;
    const line = this.source.substring(start, end);
    if (!/^\|.+\|\s*$/.test(line))
      return false;
    this.offset = end;
    this.col = lineCol + line.length;
    this.appendText();
    this.tokens.push(new Token(TEXT, {
      kind: TABLE,
      buffer: [line]
    }, null, { line: this.line, col: lineCol }));
    return true;
  }
  parseFence(char) {
    const tokenInfo = { line: this.line, col: this.col - 1, kind: "multi" };
    this.appendText();
    this.nextToken(2);
    while (!this.isDone()) {
      const cur = this.getToken();
      if (cur === `
`) {
        this.col = -1;
        this.line++;
      }
      if (cur === char && this.peek() === char && this.peekNext() === char)
        break;
      this.pushToken(cur);
    }
    const chunk = this.blank;
    this.offset += 2;
    this.blank = "";
    if (char === '"') {
      this.subString(deindent(chunk), false, tokenInfo);
    } else {
      this.addToken(CODE, chunk, tokenInfo);
    }
    return true;
  }
  parseItem(char) {
    const depth = Math.floor(this.blank.length / 2);
    while (this.peek() !== " ")
      this.nextToken();
    if (isDigit(char)) {
      this.blank = "";
    }
    this.parseLine();
    this.appendText(char, depth);
    return true;
  }
  parseText(char) {
    this.appendText();
    let i = this.offset;
    if ("*_".includes(char)) {
      if (this.peek() === char) {
        char += this.getToken(++i);
      } else if (!isAlphaNumeric(this.peek()))
        return;
    } else {
      this.pushToken(char);
    }
    for (let c = this.chars.length;i < c; i++) {
      if ("*_".includes(char)) {
        if (this.chars[i] === char)
          break;
      } else if (char.length === 2) {
        if (char === this.chars[i] + this.chars[i + 1])
          break;
      } else if (!isAlphaNumeric(this.chars[i], true))
        break;
      if (this.chars[i] === "." && isDigit(this.blank))
        break;
      this.pushToken(this.chars[i]);
    }
    const token = this.chars[i];
    const nextToken = this.chars[i + 1];
    if (isDigit(this.blank) && token === " " && isAlphaNumeric(nextToken)) {
      this.blank = "";
      return;
    }
    if (isDigit(this.blank) && token === "." && nextToken === " ") {
      this.parseItem(this.blank);
      return true;
    }
    if (char.length === 1 && char === token || char.length === 2 && char === token + nextToken) {
      this.offset = this.start = i + char.length;
      this.blank = char + this.blank + char;
      this.appendText();
      this.parseLine();
      this.appendText();
      return true;
    }
    if (isReadable(this.blank) && token === "*" || nextToken === " " && ");:.,".includes(token) || token === " " && (nextToken === "*" || isAlphaNumeric(nextToken))) {
      this.pushToken(token, nextToken);
      this.offset = this.start = i + 2;
      this.parseLine();
      this.appendText();
      return true;
    }
    if (token === " " && nextToken === "(" && /^[A-Z]/.test(this.blank)) {
      this.pushToken(token);
      this.offset = this.start = i + 1;
      this.parseLine();
      this.appendText();
      return true;
    }
    this.blank = "";
  }
  subString(chunk, isMarkup, tokenInfo) {
    if (chunk.indexOf("#{") === -1) {
      this.addToken(STRING, chunk, tokenInfo);
      return;
    }
    const info = { line: tokenInfo.line, col: tokenInfo.col + 1 };
    const input = split(chunk);
    const stack = [];
    let curInfo = { ...info };
    let buffer = "";
    let depth = 0;
    while (input.length) {
      const char = input.shift();
      if (char === "\\" && input[0] === '"') {
        buffer += input.shift();
        info.col += 2;
        continue;
      }
      if (char === "#" && input[0] === "{") {
        if (!depth && buffer.length) {
          this.append(buffer, curInfo);
          buffer = "";
        }
        buffer += char + input.shift();
        info.col += 2;
        curInfo = { ...info };
        stack.push(OPEN);
        depth++;
        continue;
      }
      buffer += char;
      if (char === "}" && stack[stack.length - 1] === OPEN) {
        stack.pop();
        depth--;
        if (!depth) {
          buffer = buffer.substr(2, buffer.length - 3);
          if (buffer.indexOf("#{") !== -1) {
            curInfo.col -= buffer.length - 5;
          }
          this.append(new Scanner(buffer, curInfo).scanTokens(), curInfo);
          buffer = "";
        }
        info.col++;
        continue;
      }
      if (char === '"') {
        info.col++;
        if (stack[stack.length - 1] === BEGIN) {
          stack.pop();
          depth--;
        } else {
          stack.push(BEGIN);
          depth++;
        }
        continue;
      }
      if (char === `
`) {
        info.col = 0;
        info.line++;
      } else {
        info.col++;
      }
    }
    if (buffer.length) {
      curInfo.col += 2;
      this.append(buffer, curInfo);
    }
    if (isMarkup) {
      tokenInfo.kind = "markup";
    }
    this.addToken(STRING, this.chunks, tokenInfo);
    this.chunks = [];
  }
  parseString() {
    const stack = [];
    const info = { line: this.line, col: this.col - 1 };
    while (!this.isDone()) {
      if (this.peek() === `
`) {
        this.col = -1;
        this.line++;
      }
      if (this.peek() === "#" && this.peekNext() === "{")
        stack.push(OPEN);
      if (this.peek() === "}" && stack[stack.length - 1] === OPEN)
        stack.pop();
      if (stack.length && this.peek() === '"' && this.peekToken(-1) !== "\\") {
        if (stack[stack.length - 1] === BEGIN)
          stack.pop();
        else
          stack.push(BEGIN);
      }
      if (!stack.length && this.peek() === '"' && this.peekToken(-1) !== "\\")
        break;
      this.nextToken();
    }
    if (stack.length) {
      this.col -= stack[stack.length - 1] === OPEN ? 2 : 1;
      raise(`Expecting \`${stack[stack.length - 1] === OPEN ? '"' : "}"}\``, this);
    }
    if (this.isDone()) {
      raise("Unterminated string", this);
    }
    this.nextToken();
    this.subString(this.source.substring(this.start + 1, this.offset - 1), false, info);
  }
  parseMarkup() {
    const tokenInfo = { line: this.line, col: this.col - 1, kind: "markup" };
    while (isAlphaNumeric(this.peek()))
      this.nextToken();
    const openTag = this.peekCurrent(4);
    const tagName = openTag.substr(1);
    const close = [tagName];
    const hasImmediateClosing = (name) => {
      let idx = this.offset + 1;
      while (idx < this.source.length && /\s/.test(this.source[idx]))
        idx++;
      const closing = `</${name}>`;
      return this.source.slice(idx, idx + closing.length).toLowerCase() === closing.toLowerCase();
    };
    let offset = 0;
    while (!this.isDone()) {
      if (this.peek() === `
`) {
        this.col = -1;
        this.line++;
      }
      const cur = this.peek();
      const old = this.peekToken(-1);
      const next = this.peekNext();
      const tag = `</${close[close.length - 1]}>`;
      if (cur === "/" && next === ">") {
        this.nextToken(2);
        close.pop();
      }
      if (cur === ">" && close.length) {
        const top = String(close[close.length - 1] || "").toLowerCase();
        if (isVoidTag(top) && !hasImmediateClosing(top)) {
          close.pop();
        }
      }
      if (offset && cur === "<" && isAlphaNumeric(next)) {
        let nextTag = "";
        let char;
        do {
          this.nextToken();
          char = this.peek();
          if (!isAlphaNumeric(char))
            break;
          nextTag += char;
        } while (isAlphaNumeric(char));
        this.col -= 2;
        close.push(nextTag);
      }
      if (old === ">" && tag === this.getCurrent(tag))
        close.pop();
      if (!close.length)
        break;
      this.nextToken();
      offset++;
    }
    this.subString(this.getCurrent(), true, tokenInfo);
  }
  parseRegex() {
    const prevToken = this.peekToken(-2);
    if (prevToken && isAlphaNumeric(prevToken)) {
      this.addToken(DIV);
      return;
    }
    let flags = "";
    let pattern = "";
    let i = this.offset;
    for (let c = this.chars.length;i < c; i++) {
      const last = this.chars[i - 1];
      const cur = this.chars[i];
      if (flags) {
        if ("igmu".includes(cur)) {
          flags += cur;
          continue;
        }
        if (isAlphaNumeric(cur)) {
          this.col = i;
          raise(`Unknown modifier \`${cur}\``, this);
        }
        --i;
        break;
      }
      if (cur === "/" && last !== "\\") {
        const next = this.chars[i + 1];
        if (next && isAlphaNumeric(next)) {
          if ("igmu".includes(next)) {
            flags += this.chars[++i];
            continue;
          }
          this.col = ++i;
          raise(`Unknown modifier \`${next}\``, this);
        }
        break;
      }
      if (cur === " " || cur === `
`) {
        this.addToken(DIV);
        return;
      }
      pattern += cur;
    }
    this.offset = this.start = ++i;
    this.addToken(REGEX, new RegExp(pattern, flags));
  }
  parseSymbol() {
    while (!this.isDone()) {
      const cur = this.peek();
      if (cur === "." && (this.peekNext() === `
` || this.offset + 1 >= this.chars.length))
        break;
      if (cur === "/" || isAlphaNumeric(cur, true))
        this.nextToken();
      else
        break;
    }
    this.addToken(SYMBOL);
  }
  parseDirective() {
    while (!this.isDone()) {
      const cur = this.peek();
      if (cur === "." && (this.peekNext() === `
` || this.offset + 1 >= this.chars.length))
        break;
      if (cur === "/" || isAlphaNumeric(cur, true))
        this.nextToken();
      else
        break;
    }
    this.addToken(DIRECTIVE);
  }
  parseComment(multiline) {
    if (multiline) {
      while (this.peek() !== "*" && this.peekNext() !== "/" && !this.isDone()) {
        if (this.peek() === `
`) {
          this.col = -1;
          this.line++;
        }
        this.nextToken();
      }
      if (this.isDone()) {
        raise("Unterminated comment", this);
      }
      this.nextToken(2);
      this.addToken(COMMENT_MULTI);
    } else {
      while (this.peek() !== `
` && !this.isDone())
        this.nextToken();
      this.addToken(COMMENT);
    }
  }
  isMatch(expected) {
    if (this.isDone())
      return false;
    if (this.chars[this.offset] !== expected)
      return false;
    this.nextToken();
    return true;
  }
  isDone() {
    return this.offset >= this.chars.length;
  }
  peek() {
    if (this.isDone())
      return "\x00";
    return this.chars[this.offset];
  }
  peekNext() {
    if (this.offset + 1 >= this.chars.length)
      return "\x00";
    return this.chars[this.offset + 1];
  }
  peekCurrent(offset) {
    const buffer = this.getCurrent();
    this.offset += buffer.length - offset;
    return buffer;
  }
}

// src/lib/tree/parser.js
class Parser {
  constructor(tokens, plain, ctx) {
    this.templates = ctx && ctx.templates || {};
    this.template = null;
    this.partial = [];
    this.raw = plain;
    this.tokens = tokens;
    this.current = null;
    this.buffer = [];
    this.offset = 0;
    this.depth = 0;
  }
  extension(stmts) {
    stmts.forEach((stmt) => {
      const subTree = stmt.getBody();
      const expr = subTree.pop();
      if (!isBlock(expr) || !expr.hasArgs || !expr.getArg(0) || !expr.getArg(0).isCallable) {
        return;
      }
      let root = this.templates;
      let key;
      while (subTree.length) {
        key = subTree.shift().valueOf();
        if (!root[key])
          root[key] = {};
        if (subTree.length)
          root = root[key];
      }
      root[key] = expr.getArgs()[0].value;
    });
  }
  parseRefImportSpec(alias) {
    const parts = String(alias || "").split(",").map((part) => part.trim()).filter(Boolean);
    const imports = [];
    const templates = [];
    let includeAllTemplates = false;
    parts.forEach((part) => {
      if (!part.startsWith("@template")) {
        imports.push(part);
        return;
      }
      const rest = part.slice("@template".length).trim();
      if (!rest) {
        includeAllTemplates = true;
        return;
      }
      rest.split(/\s+/).map((name) => name.trim()).filter(Boolean).forEach((name) => templates.push(name));
    });
    return { imports, includeAllTemplates, templates };
  }
  collection(token, curToken, nextToken) {
    const isFirstClassMatch = isDirective(token) && token.value === "@match" && isOpen(curToken) && curToken.tokenInfo && curToken.tokenInfo.kind === "brace";
    if (isSpecial(token) || isSlice(token) || isEnd(curToken) || isSome(curToken) && isEnd(nextToken) || isOpen(curToken) && isClose(nextToken) || isSymbol(curToken) && !isSpecial(curToken) || isText(curToken) && !(isDirective(token) && CONTROL_TYPES.includes(token.value)) || isMath(curToken) && !isSome(curToken) && curToken.type !== MINUS && token.value !== "@template") {
      if (token.value === ":nil")
        return Expr.value(null, token);
      if (token.value === ":on")
        return Expr.value(true, token);
      if (token.value === ":off")
        return Expr.value(false, token);
      if (isDirective(token)) {
        return Expr.stmt(token.value, [], token);
      }
      return Expr.symbol(token.value, isSome(curToken) || null, token);
    }
    const map2 = {};
    let optional;
    let stack = [[]];
    let key = token.value;
    while (!this.isDone() && !this.isEnd([OR, PIPE])) {
      const body = stack[stack.length - 1];
      const cur = this.next();
      const keepElseBodyDirective = key === "@else" && !body.length && isDirective(cur) && ["@do", "@match", "@let"].includes(cur.value);
      if (!this.depth && (isSymbol(cur) || isDirective(cur)) && !keepElseBodyDirective) {
        if (isSpecial(cur) || isSlice(cur)) {
          body.push(Expr.from(cur));
          continue;
        }
        this.appendTo(stack, key, map2, token, optional);
        optional = false;
        key = cur.value;
        stack = [[]];
        continue;
      }
      if (!this.depth && isComma(cur)) {
        stack.push([]);
        continue;
      }
      if (!body.length && isSome(cur)) {
        if (optional || isStatement(key)) {
          check(cur);
        }
        optional = true;
        continue;
      }
      if (!isText(cur)) {
        body.push(Expr.from(cur));
      }
    }
    this.appendTo(stack, key, map2, token, optional);
    if (isFirstClassMatch && map2.match instanceof Expr.MatchStatement) {
      const [braceBody] = map2.match.getBody();
      const cases = isBlock(braceBody) ? braceBody.getBody() : [];
      const input = Expr.local("$", token);
      return Expr.callable({
        type: BLOCK,
        value: {
          args: [input.clone()],
          body: [
            Expr.map({
              match: Expr.stmt("@match", [
                Expr.stmt([input].concat(cases), token)
              ], token)
            }, token)
          ]
        }
      }, token);
    }
    return Expr.map(map2, token);
  }
  definition(token, isAnonymous) {
    let subTree;
    if (isAnonymous) {
      subTree = this.subTree(this.statement([OR, PIPE]));
    } else {
      subTree = this.expression();
    }
    const [head2, ...body] = subTree;
    const node = {
      type: BLOCK,
      value: {}
    };
    if (head2 && head2.type !== EQUAL) {
      body.unshift(head2);
    }
    if (isLiteral(body[0]) && isBlock(body[1])) {
      const args = body[1].getArgs();
      if (args.some((x) => isLiteral(x, ".."))) {
        node.value.args = node.value.args || [];
        node.value.args[isLiteral(args[0], "..") ? "unshift" : "push"](Expr.from(LITERAL, "..", token));
      }
    }
    if (body.length)
      node.value.body = body;
    if (!isAnonymous)
      node.value.name = token.value;
    Object.defineProperty(node.value, "plain", {
      value: isBlock(body[0]) && !body[0].hasArgs
    });
    return node;
  }
  destructure(token) {
    const bindings = [{ name: token.value, rest: false }];
    let offset = this.offset;
    let hasRest = false;
    while (offset < this.tokens.length) {
      let cur = this.tokens[offset];
      while (isText(cur)) {
        offset++;
        cur = this.tokens[offset];
      }
      if (!isComma(cur))
        return null;
      offset++;
      cur = this.tokens[offset];
      while (isText(cur)) {
        offset++;
        cur = this.tokens[offset];
      }
      const isRest = isRange(cur);
      if (isRest) {
        offset++;
        cur = this.tokens[offset];
        if (cur && cur.type === DOT) {
          offset++;
          cur = this.tokens[offset];
        }
      }
      while (isText(cur)) {
        offset++;
        cur = this.tokens[offset];
      }
      if (!isLiteral(cur))
        return null;
      if (hasRest)
        raise("Rest binding must be last", cur);
      bindings.push({ name: cur.value, rest: isRest });
      hasRest = isRest;
      offset++;
      cur = this.tokens[offset];
      while (isText(cur)) {
        offset++;
        cur = this.tokens[offset];
      }
      if (isEqual(cur)) {
        return { bindings, offset };
      }
      if (!isComma(cur))
        return null;
    }
    return null;
  }
  expression() {
    const [, ...tail2] = this.statement();
    const body = this.subTree(tail2);
    return body;
  }
  statement(endToken, raw) {
    while (!this.isDone() && !this.isEnd(endToken, raw))
      this.push(raw);
    return this.pull();
  }
  isDone() {
    return isEOF(this.peek());
  }
  isEnd(endToken, raw) {
    const token = this.peek();
    if (isOpen(token) || isBegin(token))
      this.depth++;
    if (isClose(token) || isDone(token))
      this.depth--;
    if (this.depth > 0)
      return false;
    if (this.depth < 0) {
      this.depth = 0;
      return true;
    }
    return isEOL(token) || endToken && endToken.includes(token.type) || !raw && isText(token) && !hasBreaks(token);
  }
  has(token) {
    for (let i = this.offset, c = this.tokens.length;i < c; i++) {
      if (this.tokens[i].type === token)
        return true;
    }
    return false;
  }
  peek() {
    return this.tokens[this.offset];
  }
  blank() {
    const token = this.peek();
    return isText(token) && !(token.value && token.value.kind) && !hasBreaks(token);
  }
  skip(raw) {
    this.current = this.peek();
    this.offset++;
    while (!this.isDone() && (!raw && this.blank()))
      this.offset++;
    return this;
  }
  prev() {
    return this.current || {};
  }
  next(raw) {
    return this.skip(raw).prev();
  }
  seek() {
    let inc = this.offset + 1;
    let token;
    do {
      token = this.tokens[inc++] || {};
    } while (isText(token) || isComma(token));
    return token;
  }
  leaf() {
    return this.subTree(this.statement([OR, PIPE, SOME, COMMA, SYMBOL]), true);
  }
  pull() {
    return this.buffer.splice(0, this.buffer.length);
  }
  push(raw) {
    this.buffer.push(Expr.from(this.next(raw)));
  }
  parse() {
    let root = [];
    const tree = root;
    const stack = [];
    const offsets = [];
    function get2() {
      let leaf = root;
      if (leaf instanceof Expr) {
        leaf = isBlock(leaf) ? leaf.value.args : leaf.valueOf();
      }
      return leaf;
    }
    function pop() {
      const leaf = get2();
      const set = [];
      let count = leaf.length;
      while (count--) {
        const token = leaf[count];
        if (isEnd(token))
          break;
        set.unshift(token);
      }
      leaf.length = ++count;
      return set;
    }
    function push2(...token) {
      let target;
      if (root instanceof Expr) {
        if (isBlock(root)) {
          target = root.value.args || root.value.body;
        } else {
          target = root.value;
        }
      } else {
        target = root;
      }
      target.push(...token);
    }
    while (!this.isDone()) {
      const prev = this.prev();
      const token = this.next();
      const curToken = this.peek();
      const nextToken = this.seek();
      const tokenInfo = token.tokenInfo || token;
      if (isSymbol(token) || isDirective(token)) {
        const fixedToken = this.collection(tokenInfo, curToken, nextToken);
        if (isSymbol(fixedToken) && fixedToken.isOptional)
          this.next();
        if (this.raw !== false && fixedToken.value && Object.keys(fixedToken.value).length === 1 && fixedToken.value.template instanceof Expr.TemplateStatement) {
          this.extension(fixedToken.value.template.value.body);
          if (isEOL(this.peek()))
            this.skip();
          continue;
        }
        push2(fixedToken);
        continue;
      }
      if (isRange(token)) {
        if (prev && [OPEN, BEGIN, COMMA].includes(prev.type) && [CLOSE, DONE, COMMA, BLOCK].includes(curToken.type)) {
          push2(Expr.from(LITERAL, "..", tokenInfo));
          continue;
        }
        push2(Expr.range(pop(), this.leaf(), tokenInfo));
        continue;
      }
      if (!this.template && this.templates[tokenInfo.value]) {
        this.template = this.templates[tokenInfo.value];
        if (curToken.type === OPEN && this.template.body) {
          push2(...Expr.mix(this.template, this.leaf(), []));
          this.template = null;
          continue;
        }
        if (this.template[curToken.value]) {
          this.partial = [tokenInfo];
          continue;
        }
        if (!this.template.args) {
          this.template = null;
        }
      }
      if (this.template && (this.template.args || this.template[tokenInfo.value])) {
        if (!this.template.args) {
          this.template = this.template[tokenInfo.value];
          this.partial.push(tokenInfo);
        }
        if (this.template.args) {
          const left = pop();
          const right = this.leaf();
          if (this.template.args.length === 1) {
            if (left.some(isLiteral) && right.length) {
              push2(Expr.group([...left, ...Expr.mix(this.template, left, [])], tokenInfo), ...right);
            } else if (!left.length) {
              push2(Expr.group([...Expr.mix(this.template, Expr.cut(right), []), ...right], tokenInfo));
            } else {
              push2(Expr.group([...left, ...Expr.mix(this.template, left, [])], tokenInfo));
            }
          } else {
            push2(Expr.group([...Expr.mix(this.template, left, right)], tokenInfo));
          }
          this.template = null;
        }
        continue;
      }
      if (this.template) {
        this.partial.forEach((x) => push2(Expr.from(x)));
        this.template = null;
      }
      if (isLiteral(token)) {
        if (isComma(curToken) && this.has(EQUAL)) {
          const parsed = this.destructure(tokenInfo);
          if (parsed) {
            this.offset = parsed.offset + 1;
            this.current = this.tokens[parsed.offset];
            const body = this.subTree(this.statement([OR, PIPE]));
            push2(Expr.map({
              destructure: Expr.stmt("@destructure", [
                Expr.from(LITERAL, parsed.bindings, tokenInfo),
                Expr.stmt(body, { ...tokenInfo, kind: "raw" })
              ], tokenInfo)
            }, tokenInfo));
            continue;
          }
        }
        if (isEqual(curToken)) {
          push2(Expr.callable(this.definition(token), tokenInfo));
          continue;
        }
        if (isBlock(curToken) && this.has(BLOCK)) {
          const args = Expr.args([Expr.from(token)].concat(this.statement([BLOCK])));
          const body = this.expression();
          args.forEach((x) => {
            if (isRange(x))
              x.type = LITERAL;
            assert(Array.isArray(x) ? x[0] : x, true, LITERAL);
          });
          push2(Expr.callable({
            type: BLOCK,
            value: { args, body }
          }, tokenInfo));
          continue;
        }
      }
      if (isRef(token) && token.isRaw && token.value && token.value.alt && token.value.href) {
        const spec = this.parseRefImportSpec(token.value.alt.trim());
        const importBody = spec.imports.map((name) => Expr.local(name, tokenInfo));
        const map2 = {
          import: Expr.stmt("@import", importBody, tokenInfo),
          from: Expr.stmt("@from", [Expr.value(token.value.href.trim(), tokenInfo)], tokenInfo)
        };
        if (spec.includeAllTemplates || spec.templates.length) {
          const templateBody = [];
          if (spec.includeAllTemplates) {
            templateBody.push(Expr.stmt([Expr.local("*", tokenInfo)], tokenInfo));
          }
          spec.templates.forEach((name) => {
            templateBody.push(Expr.stmt([Expr.local(name, tokenInfo)], tokenInfo));
          });
          map2.template = Expr.stmt("@template", templateBody, tokenInfo);
        }
        push2(Expr.map(map2, tokenInfo));
        continue;
      }
      if (!isLiteral(token) && isBlock(curToken) && !(isOpen(token) || isClose(token) || isComma(token))) {
        raise(`Expecting literal but found \`${token.value}\``, tokenInfo);
      }
      if (isLiteral(token) && isNot(curToken)) {
        push2(Expr.literal({ type: LITERAL, value: token.value, cached: true }, tokenInfo));
        this.next();
        continue;
      }
      if (isBlock(token)) {
        push2(Expr.callable(this.definition(token, true), tokenInfo));
        continue;
      }
      if (isOpen(prev) && isLogic(token) && !isClose(nextToken)) {
        this.depth++;
        push2(Expr.expression({
          type: token.type,
          value: this.subTree(this.statement([CLOSE]), true)
        }, tokenInfo));
        continue;
      }
      if (isList(token)) {
        if (isOpen(token) || isBegin(token)) {
          let leaf;
          if (token.value === "#{") {
            leaf = Expr.body([], tokenInfo);
          } else {
            leaf = isOpen(token) ? Expr.block({ args: [] }, tokenInfo, true) : Expr.array([], tokenInfo);
          }
          push2(leaf);
          stack.push(root);
          offsets.push(token);
          root = leaf;
        } else {
          const start = offsets[offsets.length - 1];
          if (!start) {
            raise(`Expecting \`${isClose(token) ? "(" : "["}\` before \`${token.value}\``, tokenInfo);
          }
          if (isOpen(start) && !isClose(token)) {
            raise(`Expecting \`)\` but found \`${token.value}\``, tokenInfo);
          }
          if (isBegin(start) && !isDone(token)) {
            raise(`Expecting \`]\` but found \`${token.value}\``, tokenInfo);
          }
          root = stack.pop();
          offsets.pop();
          if (isClose(token) && isBlock(curToken)) {
            const leaf = get2();
            const group = leaf[leaf.length - 1];
            if (isBlock(group) && group.hasArgs) {
              let args = group.getArgs();
              if (args.length === 1 && isRange(args[0]) && args[0].value && Array.isArray(args[0].value.begin) && (!args[0].value.end || !args[0].value.end.length)) {
                args = args[0].value.begin.concat([Expr.from(LITERAL, "..", args[0].tokenInfo || tokenInfo)]);
              }
              args = args.map((arg) => {
                if (isRange(arg)) {
                  arg = arg.clone();
                  arg.type = LITERAL;
                }
                return arg;
              });
              if (args.length && args.every((arg) => isLiteral(arg))) {
                this.next();
                const body = this.subTree(this.statement([OR, PIPE]));
                leaf[leaf.length - 1] = Expr.callable({
                  type: BLOCK,
                  value: {
                    args: Expr.args(args),
                    body
                  }
                }, args[0] && args[0].tokenInfo || group.tokenInfo || curToken.tokenInfo || tokenInfo);
                continue;
              }
            }
          }
        }
      } else if (isText(token) && token.value.kind === TABLE) {
        const rows = [token];
        while (!this.isDone()) {
          const nextRow = this.peek();
          if (isText(nextRow) && nextRow.value.kind === TABLE) {
            rows.push(this.next(true));
            continue;
          }
          if (this.isBlankTextToken(nextRow)) {
            this.next(true);
            continue;
          }
          break;
        }
        const table = this.tableFromTokens(rows, tokenInfo);
        if (table) {
          push2(table);
          if (!(isEnd(this.peek()) || isClose(this.peek()) || isDone(this.peek()))) {
            push2(Expr.from(EOL, ".", tokenInfo));
          }
        } else {
          rows.forEach((row) => {
            if (this.isTextConvertible(row)) {
              push2(this.convertTextToString(row, tokenInfo));
            }
          });
        }
      } else if (isText(token) && token.value.kind === HEADING) {
        const namespace = this.namespaceFromHeading(token, tokenInfo);
        if (namespace) {
          push2(namespace);
        } else if (this.hasInterpolation(token)) {
          push2(this.convertTextToString(token, tokenInfo));
        }
      } else if (isText(token) && this.hasInterpolation(token)) {
        push2(this.convertTextToString(token, tokenInfo));
      } else if (!(isText(token) || isCode(token) || isRef(token))) {
        if (isString(token) && tokenInfo.kind === "markup" && typeof token.value === "string") {
          try {
            push2(Expr.tag(parseTag(token.value), tokenInfo));
          } catch (_) {
            push2(Expr.from(token));
          }
        } else if (isString(token) && Array.isArray(token.value)) {
          push2(Expr.literal({ type: STRING, value: this.subTree(token.value, true) }, tokenInfo));
        } else {
          push2(Expr.from(token));
        }
      }
      if (isNumber(token) && !isUnit(token) && this.raw !== true) {
        if (isNumber(curToken))
          push2(Expr.from(PLUS, "+"));
        if (isLiteral(curToken) && (isMath(nextToken) || isLiteral(nextToken) || isEnd(nextToken) || isComment(nextToken)) || isOpen(curToken) && !(isClose(nextToken) || isComment(nextToken)))
          push2(Expr.from(MUL, "*"));
      }
    }
    if (offsets.length) {
      const lastToken = offsets[offsets.length - 1];
      const { value, line, col } = this.current.tokenInfo || this.current;
      raise(`Expecting \`${isOpen(lastToken) ? ")" : "]"}\``, { line, col: col + value.length });
    }
    return tree;
  }
  isTextConvertible(token) {
    if (!token || !token.value || !Array.isArray(token.value.buffer))
      return false;
    return token.value.buffer.some((chunk) => {
      if (typeof chunk === "string")
        return chunk.trim().length > 0;
      if (Array.isArray(chunk))
        return !!chunk[2];
      return true;
    });
  }
  hasInterpolation(token) {
    if (!token || !token.value || !Array.isArray(token.value.buffer))
      return false;
    return token.value.buffer.some((chunk) => {
      if (Array.isArray(chunk))
        return !!chunk[2];
      if (typeof chunk === "object" && chunk !== null)
        return chunk.kind !== "raw";
      return false;
    });
  }
  isBlankTextToken(token) {
    if (!isText(token) || !token.value || !Array.isArray(token.value.buffer))
      return false;
    return token.value.buffer.every((chunk) => typeof chunk === "string" && !chunk.trim().length);
  }
  textChunkToSource(chunk) {
    if (typeof chunk === "string")
      return chunk;
    if (Array.isArray(chunk))
      return `${chunk[1]}${chunk[2]}${chunk[1]}`;
    if (isRef(chunk))
      return chunk.value.text;
    if (chunk && typeof chunk.value === "string")
      return chunk.value;
    return "";
  }
  convertTextToString(token, tokenInfo) {
    const source = this.textPrefix(token.value) + token.value.buffer.map((chunk) => this.textChunkToSource(chunk)).join("");
    const [subToken] = new Scanner(quote(source), tokenInfo).scanTokens();
    if (isString(subToken) && Array.isArray(subToken.value)) {
      return Expr.literal({ type: STRING, value: this.subTree(subToken.value, true) }, tokenInfo);
    }
    return Expr.from(subToken);
  }
  textPrefix(value) {
    if (!value || !value.kind)
      return "";
    if (value.kind === BLOCKQUOTE)
      return "> ";
    if (value.kind === HEADING)
      return `${Array.from({ length: value.level || 1 }).join("#")}# `;
    if (value.kind === OL_ITEM)
      return `${value.style || value.level || 1}. `;
    if (value.kind === UL_ITEM)
      return `${value.style || "-"} `;
    return "";
  }
  textTokenToSource(token) {
    if (!token || !token.value || !Array.isArray(token.value.buffer))
      return "";
    return token.value.buffer.map((chunk) => this.textChunkToSource(chunk)).join("");
  }
  namespaceFromHeading(token, tokenInfo) {
    if (!isText(token) || token.value.kind !== HEADING)
      return null;
    const source = this.textTokenToSource(token).trim();
    const matches = source.match(/^([A-Za-z_][A-Za-z0-9_]*)::$/);
    if (!matches)
      return null;
    return Expr.map({
      namespace: Expr.stmt("@namespace", [
        Expr.value(matches[1], tokenInfo),
        Expr.value(token.value.level || 1, tokenInfo)
      ], tokenInfo)
    }, tokenInfo);
  }
  tableFromTokens(rows, tokenInfo) {
    if (!rows || rows.length < 2)
      return null;
    const parseRow = (token) => {
      const source = this.textTokenToSource(token).trim();
      if (!source.startsWith("|") || !source.endsWith("|"))
        return null;
      return source.slice(1, -1).split("|").map((cell) => cell.trim());
    };
    const header = parseRow(rows[0]);
    const separator = parseRow(rows[1]);
    if (!header || !separator || header.length !== separator.length)
      return null;
    if (!separator.every((cell) => /^:?-{3,}:?$/.test(cell)))
      return null;
    const dataRows = rows.slice(2).map(parseRow);
    if (dataRows.some((row) => !row || row.length !== header.length))
      return null;
    return Expr.map({
      table: Expr.stmt("@table", [
        Expr.value({ headers: header, rows: dataRows }, tokenInfo)
      ], tokenInfo)
    }, tokenInfo);
  }
  split() {
    const statements = [];
    let currentLine = 0;
    while (!this.isDone()) {
      const body = this.statement([EOL], true);
      const curToken = this.tokens[this.offset++];
      const lines = [];
      if (!isEOF(curToken)) {
        body.push(Expr.literal(curToken));
      }
      if (!currentLine) {
        lines.push(currentLine++);
      } else if (!isText(body[0]) || !hasBreaks(body[0])) {
        lines.push(currentLine - 1);
      }
      for (let i = 0, c = body.length;i < c; i++) {
        if (hasBreaks(body[i])) {
          let count = 0;
          if (isText(body[i])) {
            body[i].value.buffer.forEach((x) => {
              count += x.split(`
`).length - 1;
            });
          } else {
            count = body[i].value.split(`
`).length - 1;
          }
          while (count--)
            lines.push(currentLine++);
        }
      }
      statements.push({ body, lines });
      if (!this.tokens[this.offset])
        break;
    }
    return statements;
  }
  appendTo(set, name, target, tokenInfo, isOptional) {
    const prop = name.substr(1) + (isOptional ? "?" : "");
    if (!isStatement(name)) {
      if (hasStatements(target))
        raise(`Unexpected \`:${prop}\` on statement`, tokenInfo);
      target[prop] = Expr.body([], tokenInfo);
    } else {
      target[prop] = Expr.stmt(name, [], tokenInfo);
    }
    let hasConditional = false;
    set.forEach((sub) => {
      let body = this.subTree(sub, true);
      while (body.length === 1 && isBlock(body[0]) && body[0].tokenInfo.kind !== "brace" && !body[0].isCallable && !(body[0].getArg(0) && body[0].getArg(0).isExpression) && (["@import", "@export"].includes(name) || !(body[0].getArg(0) && body[0].getArg(0).isObject))) {
        body = body[0].getArgs();
      }
      const lastToken = sub[sub.length - 1];
      if (name === "@if" || name === "@while" && !hasConditional) {
        if (!isBlock(body[0])) {
          if (!isClose(lastToken)) {
            raise(`Missing block before \`${lastToken}\``, lastToken.tokenInfo);
          } else {
            raise(`Expecting statement after \`${lastToken}\``, lastToken.tokenInfo);
          }
        }
        if (name === "@while")
          hasConditional = true;
      }
      if (isBlock(body[0]) || body.length > 1) {
        if (body.some(isBlock)) {
          target[prop].push(Expr.body(body, tokenInfo));
        } else {
          target[prop].push(Expr.stmt(body, { ...tokenInfo, kind: "raw" }));
        }
      } else {
        target[prop].push(...body);
      }
    });
  }
  subTree(tokens, raw = false) {
    return new Parser(tokens.concat(new Token(EOF, "", null)), raw || this.raw, this).parse();
  }
  static getAST(source, mode = "parse", environment) {
    const scanner = new Scanner(source, null, environment);
    const tokens = scanner.scanTokens();
    if (mode === "raw" || mode === null)
      return tokens;
    const parserMode = mode === "parse" || typeof mode === "undefined" ? undefined : mode === "inline" ? false : mode === "split" || mode === true;
    const parser = new Parser(tokens, parserMode, environment);
    if (mode === "split")
      return parser.split();
    return parser.parse();
  }
  static sub(source, environment) {
    return Parser.getAST(`.
${source}`, "inline", environment).slice(1);
  }
}

// src/lib/tree/eval.js
var LAZY_DESCRIPTORS = new Set(["Loop", "Set"]);
var OPS_MUL_DIV = new Set([MUL, DIV]);
var OPS_PLUS_MINUS_MOD = new Set([PLUS, MINUS, MOD]);
var OPS_LOGIC = new Set([LESS, LESS_EQ, GREATER, GREATER_EQ, EQUAL, EXACT_EQ, NOT_EQ, LIKE, NOT]);

class Eval {
  static getResultTagToken(token) {
    if (!isObject(token))
      return null;
    const value = token.valueOf();
    const tag = value && value.__tag;
    const payload = value && value.value;
    if (!tag || !payload || typeof tag.getBody !== "function" || typeof payload.getBody !== "function") {
      return null;
    }
    const [head2] = tag.getBody();
    if (!isSymbol(head2))
      return null;
    if (![":ok", ":err"].includes(head2.valueOf()))
      return null;
    return head2;
  }
  static async buildResultToken(kind, body, environment, parentTokenInfo) {
    const values = await Eval.do(body, environment, "Result", true, parentTokenInfo);
    return Expr.map({
      __tag: Expr.body([Expr.symbol(`:${kind}`, false, parentTokenInfo)], parentTokenInfo),
      value: Expr.body(values, parentTokenInfo)
    }, parentTokenInfo);
  }
  static normalizeBraceRecordArgs(args) {
    const normalized = [];
    let changed = false;
    for (let i = 0, c = args.length;i < c; i++) {
      const cur = args[i];
      const next = args[i + 1];
      if (isString(cur) && isSymbol(next) && next.value === ":") {
        normalized.push(Expr.symbol(`:${cur.value}`, false, cur.tokenInfo || cur));
        changed = true;
        i++;
        continue;
      }
      normalized.push(cur);
    }
    return changed ? normalized : args;
  }
  static tableCellToken(value, tokenInfo) {
    const input = typeof value === "string" ? value.trim() : value;
    if (input === "" || input === null || typeof input === "undefined") {
      return Expr.value(null, tokenInfo);
    }
    if (typeof input === "string" && /^-?\d+(?:\.\d+)?$/.test(input)) {
      return Expr.value(parseFloat(input), tokenInfo);
    }
    return Expr.value(input, tokenInfo);
  }
  static splitMatchCases(tokens) {
    const output = [];
    let current2 = [];
    for (let i = 0, c = tokens.length;i < c; i++) {
      const token = tokens[i];
      if (isComma(token)) {
        if (current2.length)
          output.push(current2);
        current2 = [];
        continue;
      }
      current2.push(token);
    }
    if (current2.length)
      output.push(current2);
    return output;
  }
  static templateNameFromEntry(entry) {
    const body = isBlock(entry) ? entry.getBody() : [entry];
    return body.filter((token) => token && !isComma(token) && !isBlock(token)).map((token) => token.valueOf()).join("").trim();
  }
  static templateImportSpec(templateStmt) {
    const spec = {
      hasTemplateImport: false,
      includeAll: false,
      names: []
    };
    if (!(templateStmt instanceof Expr.TemplateStatement)) {
      return spec;
    }
    spec.hasTemplateImport = true;
    templateStmt.getBody().forEach((entry) => {
      const name = Eval.templateNameFromEntry(entry);
      if (!name)
        return;
      if (name === "*" || name === "@template") {
        spec.includeAll = true;
        return;
      }
      if (!spec.names.includes(name)) {
        spec.names.push(name);
      }
    });
    return spec;
  }
  static resolveTemplateByName(templates, name) {
    if (!templates || !name)
      return null;
    let node = templates;
    for (let i = 0, c = name.length;i < c; i++) {
      node = node[name[i]];
      if (!node)
        return null;
    }
    return node && node.args ? node : null;
  }
  static registerTemplateByName(templates, name, definition) {
    if (!templates || !name || !definition)
      return;
    let root = templates;
    for (let i = 0, c = name.length - 1;i < c; i++) {
      const key = name[i];
      if (!root[key])
        root[key] = {};
      root = root[key];
    }
    root[name[name.length - 1]] = definition;
  }
  static async resolveMatchBody(input, cases, environment, parentTokenInfo) {
    const target = Eval.getResultTagToken(input) || input;
    for (let i = 0, c = cases.length;i < c; i++) {
      const [head2, ...body] = cases[i];
      if (!head2)
        continue;
      if (head2 instanceof Expr.ElseStatement) {
        return head2.getBody();
      }
      if (!body.length) {
        check(head2, "statement", "after");
      }
      if (isBlock(head2) && isLogic(head2.getArg(0))) {
        const [kind, ...others] = head2.getArgs();
        const newBody = Expr.expression({ type: kind.type, value: [target].concat(others) }, parentTokenInfo);
        const [result] = await Eval.do([newBody], environment, "Expr", true, parentTokenInfo);
        if (result && result.value === true) {
          return body;
        }
      } else {
        const result = await Eval.do([head2], environment, "Match", true, parentTokenInfo);
        for (let j = 0, k = result.length;j < k; j++) {
          let subBody = result[j];
          if (isArray(subBody)) {
            if (isRange(subBody.value[0])) {
              subBody = await subBody.value[0].value.run(true);
            }
            if (subBody.valueOf().some((x) => !hasDiff(x, target))) {
              return body;
            }
          }
          if (!hasDiff(target, subBody)) {
            return body;
          }
        }
      }
    }
    return null;
  }
  constructor(tokens, environment, noInheritance) {
    if (!(environment instanceof Env)) {
      environment = null;
    }
    this.convert = Eval.wrap(this);
    this.derive = !!(noInheritance && environment);
    this.expr = tokens;
    this.env = !this.derive ? new Env(environment) : environment;
    this.rootEnv = this.env;
    this.namespaceStack = [];
    this.namespaceRoots = {};
    this.descriptor = "Root";
    this.result = [];
    this.offset = 0;
    this.key = null;
    this.ctx = null;
  }
  enterNamespace(name, level, tokenInfo) {
    while (this.namespaceStack.length >= level)
      this.namespaceStack.pop();
    const parent = this.namespaceStack[this.namespaceStack.length - 1] || null;
    let node;
    if (parent) {
      node = parent.children[name];
    } else {
      node = this.namespaceRoots[name];
    }
    if (!node) {
      const parentScope = parent ? parent.scope : this.rootEnv;
      const exports = {};
      const scope = new Env(parentScope);
      node = {
        name,
        level,
        scope,
        exports,
        children: {}
      };
      if (parent) {
        parent.children[name] = node;
        parent.exports[name] = Expr.map(exports, tokenInfo);
        parent.scope.def(name, Expr.map(exports, tokenInfo));
      } else {
        this.namespaceRoots[name] = node;
        this.rootEnv.def(name, Expr.map(exports, tokenInfo));
      }
    }
    this.namespaceStack.push(node);
    this.env = node.scope;
  }
  registerNamespaceExport(name) {
    if (!this.namespaceStack.length)
      return;
    if (!this.env.locals[name])
      return;
    const current2 = this.namespaceStack[this.namespaceStack.length - 1];
    current2.exports[name] = this.env.locals[name];
  }
  replace(v, ctx) {
    if (!ctx) {
      this.result[Math.max(0, this.result.length - 1)] = v;
    } else {
      this.ctx = v;
    }
    return this;
  }
  discard(n = 1) {
    while (n--)
      this.result.pop();
    return this;
  }
  append(...a2) {
    this.result.push(...a2);
    return this;
  }
  move(n) {
    this.offset += n || 1;
    return this;
  }
  isLazy() {
    return LAZY_DESCRIPTORS.has(this.descriptor);
  }
  isDone() {
    return this.offset >= this.expr.length;
  }
  getOlder() {
    return this.result[this.result.length - 2];
  }
  getPrev() {
    return this.result[this.result.length - 1];
  }
  olderToken() {
    return this.expr[this.offset - 2];
  }
  newerToken() {
    return this.expr[this.offset + 2];
  }
  nextToken() {
    return this.expr[this.offset + 1];
  }
  oldToken() {
    return this.expr[this.offset - 1];
  }
  async execute(label, callback) {
    const tokens = this.result = [];
    this.descriptor = label;
    this.offset = 0;
    for (;!this.isDone(); this.move())
      try {
        this.ctx = this.expr[this.offset];
        if (isComment(this.ctx))
          continue;
        await callback();
      } catch (e) {
        if (e instanceof TypeError) {
          raise(e.message, this.ctx.tokenInfo, label);
        }
        e.prevToken = this.oldToken() || this.olderToken();
        e.stack = e.message;
        throw e;
      }
    this.descriptor = "Root";
    this.result = [];
    return tokens;
  }
  async evalInfixCalls() {
    const prev = this.getPrev();
    const older = this.getOlder();
    const next = this.nextToken();
    if (isResult(older) && prev.isCallable && isResult(this.ctx) && !isEnd(this.olderToken())) {
      if (isBlock(this.ctx)) {
        const [head2, ...tail2] = await Eval.do(this.ctx.getArgs(), this.env, "Fn", false, this.ctx.tokenInfo);
        const args = [older, Expr.from(COMMA), head2];
        this.discard(2).append(...await Eval.do([prev, Expr.block({ args }, prev.tokenInfo)], this.env, "Lit", false, this.ctx.tokenInfo)).append(...tail2);
      } else {
        const args = [older, Expr.from(COMMA), this.ctx];
        this.discard(2).append(...await Eval.do([prev, Expr.block({ args }, prev.tokenInfo)], this.env, "Lit", false, this.ctx.tokenInfo));
      }
      return true;
    }
    if (isPipe(this.ctx)) {
      if (!(isData(prev) || isRange(prev)))
        check(this.ctx, "value", "before");
      if (!next || !isInvokable(next))
        check(this.ctx, "callable", "after");
      assert(next, true, LITERAL, BLOCK);
      const nextToken = this.expr[this.offset + 2];
      let nextArgs = isBlock(nextToken) ? nextToken.getArgs() : null;
      let cutOffset = isBlock(nextToken) ? 2 : 1;
      let fixedBody = [];
      if (isDot(nextToken)) {
        const { body, offset } = Expr.chunk(this.expr, this.offset + 1, true);
        cutOffset = offset;
        nextArgs = isBlock(body[body.length - 1]) ? body.pop().getArgs() : null;
        fixedBody = body.concat(Expr.block({ args: [prev].concat(nextArgs ? Expr.from(COMMA) : [], nextArgs || []) }, next.tokenInfo));
      } else {
        fixedBody = [next, Expr.block({ args: [prev, Expr.from(COMMA)].concat(nextArgs || []) }, next.tokenInfo)];
      }
      this.discard().append(...await Eval.do(fixedBody, this.env, "Fn", false, this.ctx.tokenInfo));
      this.move(cutOffset);
      return true;
    }
    if (isBlock(prev) && isMod(this.ctx) && next.isObject) {
      this.discard().append(...await Eval.do(prev.getBody(), Env.create(next.valueOf()), "%", false, this.ctx.tokenInfo)).move();
      return true;
    }
  }
  async evalDotProps() {
    const prev = this.getPrev();
    const next = this.nextToken();
    if (isDot(this.ctx)) {
      if (!prev || isNumber(prev) && !isUnit(prev) || isSymbol(prev)) {
        if (isNumber(prev) && isLiteral(next) && this.env.has(next.value)) {
          const call = this.env.get(next.value);
          if (call.body[0].getArgs().length !== 1) {
            raise(`Unexpected call to \`${next.value}\``);
          }
          const scope = new Env(this.env);
          const body = call.body[0].getBody();
          Env.merge([prev], call.body[0].getArgs(), false, scope);
          this.discard().append(...await Eval.do(body, scope, "Call", false, this.ctx.tokenInfo)).move(2);
          return true;
        }
        check(prev || this.ctx, "map", prev ? null : "before");
      }
      if (!(isLiteral(next) || isBlock(next) && next.value.name)) {
        if (!next) {
          check(this.ctx, LITERAL, "after");
        } else {
          assert(next, true, LITERAL);
        }
      }
      const key = next.value.name || next.value;
      const map2 = isArray(prev) ? Expr.plain(prev.value) : prev.value;
      if (typeof map2[key] === "undefined") {
        let info;
        if (typeof map2 === "string") {
          info = `\`${serialize(map2)}\``;
        } else if (!Array.isArray(map2)) {
          info = `(${Object.keys(map2).map((k) => `:${k}`).join(" ")})`;
        } else {
          info = `[${map2.length > 1 ? `0..${map2.length - 1}` : map2.length}]`;
        }
        raise(`Missing property \`${next}\` in ${info}`, next.tokenInfo);
      }
      const newToken = this.newerToken();
      const entry = map2[key];
      if (isPlain2(entry) && Array.isArray(entry.body) && isBlock(newToken) && newToken.hasArgs) {
        const callable = entry.body[0] && entry.body[0].isCallable ? entry.body[0] : Expr.callable({
          type: BLOCK,
          value: {
            args: entry.args || [],
            body: entry.body,
            name: key
          }
        }, this.ctx.tokenInfo);
        this.discard().append(...await Eval.do([callable, newToken], this.env, "Fn", false, this.ctx.tokenInfo)).move(2);
        return true;
      }
      if (typeof map2[key] === "function" && isBlock(newToken) && newToken.hasArgs) {
        const fixedArgs = await Eval.do(newToken.getArgs(), this.env, "Args", false, this.ctx.tokenInfo);
        const result = await map2[key](...Expr.plain(fixedArgs, this.convert, `<${key}>`));
        this.discard();
        if (typeof result !== "undefined") {
          this.append(Expr.value(result));
        }
        this.move(2);
        return true;
      }
      if (!isBlock(next)) {
        if (isPlain2(entry) && Array.isArray(entry.body)) {
          this.discard().append(...await Eval.do(entry.body, this.env, `:${key}`, false, this.ctx.tokenInfo)).move();
        } else if (map2[key] instanceof Expr) {
          this.discard().append(...await Eval.do(map2[key].getBody(), this.env, `:${key}`, false, this.ctx.tokenInfo)).move();
        } else {
          this.replace(Expr.value(map2[key])).move();
        }
      } else if (map2[key] instanceof Expr) {
        map2[key].value.body = await Eval.do(next.getBody(), this.env, `:${key}`, false, this.ctx.tokenInfo);
        this.discard().move();
      } else {
        map2[key] = Expr.plain(next.head(), this.convert, `<${key}>`);
        this.discard().move();
      }
      return true;
    }
  }
  async evalRangeSets() {
    const prev = this.getPrev();
    const next = this.nextToken();
    if (isRange(prev) && isSlice(this.ctx)) {
      if (prev.value instanceof Range) {
        prev.value.take(this.ctx.value);
        if (!this.isLazy()) {
          this.discard().append(...await prev.value.run(true));
        }
      } else {
        this.discard().append(...await Range.unwrap(prev.value, (token) => [token], this.ctx));
      }
      return true;
    }
    if (isRange(this.ctx)) {
      if (this.ctx.value instanceof Range) {
        this.append(this.ctx);
        return true;
      }
      const options = await Eval.do(this.ctx.value, this.env, "Set", false, this.ctx.tokenInfo);
      if (isArray(this.ctx)) {
        this.append(Expr.array(options.reduce((p, c) => {
          if (c.isStatement)
            p.push(...c.getBody());
          else
            p.push(c);
          return p;
        }, []), this.ctx.tokenInfo));
      } else {
        assert(options.begin[0], true, NUMBER, STRING);
        const hasEnd = options.end && options.end.length > 0;
        if (hasEnd) {
          assert(options.end[0], true, NUMBER, STRING);
        }
        const fixedRange = Range.from(options.begin[0], hasEnd ? options.end[0] : undefined);
        const shouldRun = !fixedRange.infinite && !this.isLazy() && !isSlice(next);
        const subTree = await fixedRange.run(shouldRun);
        this.replace(Expr.from(RANGE, subTree, this.ctx.tokenInfo));
      }
      return true;
    }
  }
  async evalLiterals() {
    const target = this.env.get(this.ctx.value);
    const next = this.nextToken();
    if (!isLiteral(target.body[0]) && !target.body[0].isCallable && !target.body[0].hasArgs && isBlock(next) && !next.hasBody && !target.args) {
      if (target.body[0].type !== FFI)
        raise(`Unexpected call to \`${this.ctx}\``);
    }
    if (isBlock(next) && target.args && target.args.some((x) => isLiteral(x, ".."))) {
      const newToken = Expr.callable({ type: BLOCK, value: target }, this.ctx.tokenInfo).clone();
      Expr.sub(newToken.value.body, { "..": [Expr.body(next.getArgs(), this.ctx.tokenInfo)] });
      this.discard().append(...await Eval.do(newToken.getBody(), this.env, "Lit", false, this.ctx.tokenInfo)).move();
      return true;
    }
    if (target.ctx && isMod(next) && isString(target.body[0])) {
      this.append(...target.body);
      return true;
    }
    if (this.ctx.cached) {
      target.body[0].cached = {};
    }
    this.append(...await Eval.do(target.body, this.env, "Lit", false, this.ctx.tokenInfo));
    return true;
  }
  async evalTagExpr(source) {
    if (!source)
      return [];
    const body = Parser.sub(source, this.env);
    return Eval.do(body, this.env, "TagExpr", false, this.ctx.tokenInfo);
  }
  async evalTags() {
    if (!this.ctx || !this.ctx.isTag)
      return false;
    const normalizeChild = (token) => {
      if (!token)
        return null;
      if (token.isTag)
        return token.value;
      return Expr.plain(token, this.convert, "<TagChild>");
    };
    const evaluateNode = async (node) => {
      const attrs = {};
      const children = [];
      for (const spread of node.spreads || []) {
        const [spreadValue] = await this.evalTagExpr(spread.expr);
        if (typeof spreadValue === "undefined" || spreadValue === null)
          continue;
        const plain = Expr.plain(spreadValue, this.convert, "<TagSpread>");
        if (!plain || Array.isArray(plain) || typeof plain !== "object") {
          raise("Tag spread expects an object value", this.ctx.tokenInfo);
        }
        Object.assign(attrs, plain);
      }
      for (const key of Object.keys(node.attrs || {})) {
        const value = node.attrs[key];
        if (value && typeof value === "object" && typeof value.expr === "string") {
          const [exprValue] = await this.evalTagExpr(value.expr);
          attrs[key] = typeof exprValue === "undefined" ? "" : Expr.plain(exprValue, this.convert, "<TagAttr>");
        } else {
          attrs[key] = value;
        }
      }
      for (const child of node.children || []) {
        if (typeof child === "string") {
          children.push(child);
          continue;
        }
        if (child && typeof child.expr === "string") {
          const parts = await this.evalTagExpr(child.expr);
          parts.forEach((part) => {
            const fixed2 = normalizeChild(part);
            if (fixed2 !== null && typeof fixed2 !== "undefined")
              children.push(fixed2);
          });
          continue;
        }
        const [resolved] = await Eval.do([Expr.tag(child, this.ctx.tokenInfo)], this.env, "TagNode", false, this.ctx.tokenInfo);
        const fixed = normalizeChild(resolved);
        if (fixed !== null && typeof fixed !== "undefined")
          children.push(fixed);
      }
      const resolvedNode = {
        name: node.name,
        attrs,
        children,
        selfClosing: node.selfClosing && !children.length
      };
      const component = /^[A-Z]/.test(resolvedNode.name) && this.env.has(resolvedNode.name, true);
      if (!component) {
        return [Expr.tag(resolvedNode, this.ctx.tokenInfo)];
      }
      const props = {
        ...resolvedNode.attrs,
        children: resolvedNode.children
      };
      return Eval.do([
        Expr.local(resolvedNode.name, this.ctx.tokenInfo),
        Expr.block({ args: [Expr.value(props, this.ctx.tokenInfo)] }, this.ctx.tokenInfo)
      ], this.env, "TagComp", false, this.ctx.tokenInfo);
    };
    this.append(...await evaluateNode(this.ctx.value));
    return true;
  }
  async evalLogic() {
    const { type, value } = this.ctx;
    let result = await Eval.do(value, this.env, "Expr", true, this.ctx.tokenInfo);
    if (isSome(this.ctx) || isEvery(this.ctx)) {
      const values = await Promise.all(result.map((token) => {
        return Eval.do([token], this.env, "Expr", false, this.ctx.tokenInfo);
      }));
      this.append(Expr.value(values[isSome(this.ctx) ? "some" : "every"]((x) => x[0].valueOf())));
      return true;
    }
    if (result.length > 2) {
      for (let i = 1, c = value.length;i < c; i++) {
        let left;
        let right;
        try {
          left = await Eval.do(value.slice(0, i), this.env, "LogicArg", true, this.ctx.tokenInfo);
          right = await Eval.do(value.slice(i), this.env, "LogicArg", true, this.ctx.tokenInfo);
        } catch (_) {
          continue;
        }
        if (left.length === 1 && right.length === 1) {
          result = [left[0], right[0]];
          break;
        }
      }
    }
    if (result.length > 2)
      raise(`Expecting exactly 2 arguments, given ${result.length}`);
    this.append(Eval.logic(type, result[0], result[1], this.ctx.tokenInfo));
    return true;
  }
  async evalBlocks() {
    const prev = this.getPrev();
    if (prev && this.descriptor !== "Expr" && !(isMath(prev) || isEnd(prev)) && !isEnd(this.oldToken())) {
      if (!(prev.isFFI || prev.isCallable || prev.isFunction || prev.isTag || isMixed(prev, "function"))) {
        check(prev, "callable");
      }
      if (prev.isFFI && prev.isRaw) {
        const callback = (...input) => Eval.do(input, this.env, "FFI", false, this.ctx.tokenInfo);
        const result = await prev.value.target(this.ctx.getArgs(), callback);
        if (typeof result === "undefined")
          this.discard();
        else
          this.replace(Expr.value(result, this.ctx.tokenInfo));
        return true;
      }
      const args2 = await Eval.do(this.ctx.getArgs(), this.env, "Call", false, this.ctx.tokenInfo);
      const fixedArgs = args2.filter((x) => !isLiteral(x, "_"));
      if (prev.isTag) {
        const plainArgs = Expr.plain(fixedArgs, this.convert, "<Tag>");
        this.replace(Expr.tag(composeTag(prev.value, plainArgs), this.ctx.tokenInfo));
        return true;
      }
      if (prev.isFFI) {
        let result;
        const label = prev.value.label || "";
        const supportsCallableArgs = ["map", "filter"].includes(label);
        const preparedArgs = fixedArgs.map((arg) => {
          if (supportsCallableArgs && arg && arg.isCallable) {
            return (...input) => {
              return this.convert(arg, Expr.value(input).valueOf(), `<${prev.value.label || "FFI"}>`);
            };
          }
          return arg;
        });
        if (!(this.ctx.getArg(0) && this.ctx.getArg(0).isBlock)) {
          result = await prev.value.target(...preparedArgs);
        } else {
          result = await prev.value.target(preparedArgs);
        }
        if (typeof result === "undefined")
          this.discard();
        else
          this.replace(Expr.value(result, this.ctx.tokenInfo));
        return true;
      }
      if (isMixed(prev, "function")) {
        const result = await prev.valueOf()(...Expr.plain(fixedArgs, this.convert, `<${prev.value.name || "Function"}>`));
        if (typeof result === "undefined")
          this.discard();
        else
          this.replace(Expr.value(result));
        return true;
      }
      if (prev.value.env instanceof Env) {
        const { env, label, target: target2 } = prev.valueOf();
        if (this.descriptor === "Lit") {
          this.replace(Expr.fn({
            env,
            label,
            target: target2,
            args: fixedArgs
          }, this.ctx.tokenInfo));
        } else {
          const scope2 = new Env(env);
          const { body: body2 } = env.get(target2);
          const nextArgs = (prev.hasArgs ? prev.getArgs() : []).concat(fixedArgs);
          Env.merge(Expr.args(nextArgs), body2[0].getArgs(), false, scope2);
          this.discard().append(...await Eval.do(body2[0].getBody(), scope2, label, false, this.ctx.tokenInfo));
        }
        return true;
      }
      if (prev.isFunction) {
        const { label, target: target2 } = prev.valueOf();
        const nextArgs = (prev.getArgs() || []).concat(fixedArgs);
        const result = await target2(...Expr.plain(nextArgs, this.convert, label));
        if (typeof result !== "undefined") {
          this.replace(Expr.value(result, this.ctx.tokenInfo));
        } else {
          this.discard();
        }
        return true;
      }
      const { target, scope } = Env.sub(fixedArgs, prev.value, this.env);
      if (fixedArgs.length > prev.length && !prev.getArgs().some((x) => isLiteral(x, ".."))) {
        argv(args2, prev, prev.length);
      }
      if (prev.hasInput) {
        const nextArgs = prev.getArgs().map((sub, j) => {
          if (isLiteral(sub, "_")) {
            if (!args2.length)
              argv(null, prev, j);
            return args2.shift();
          }
          return sub;
        });
        const offset = nextArgs.length + args2.length;
        if (offset < prev.value.length)
          argv(null, prev, offset);
        if (offset > prev.value.length)
          argv(args2, prev, offset - 1);
        if (nextArgs.length < prev.value.length) {
          nextArgs.push(Expr.from(COMMA), ...fixedArgs);
        }
        this.discard().append(...await Eval.do([
          Expr.callable({
            type: BLOCK,
            value: {
              args: prev.getInput(),
              body: this.env.get(prev.getName()).body
            }
          }, prev.tokenInfo),
          Expr.block({ args: nextArgs }, this.ctx.tokenInfo)
        ], this.env, "Fn", false, prev.tokenInfo));
        return true;
      }
      if (prev.source && fixedArgs.length < prev.length) {
        if (target.args.length < prev.length) {
          target.args = prev.getArgs().concat(target.args);
        }
        if (this.descriptor !== "Lit" && prev.isCallable && prev.length && !fixedArgs.length) {
          raise(`Missing arguments to call \`${prev.getName()}\``);
        }
        this.replace(Expr.callable({
          type: BLOCK,
          value: {
            args: args2,
            input: target.args,
            source: prev.source,
            length: prev.length
          }
        }, prev.tokenInfo));
      } else {
        let clean = false;
        let ctx = scope;
        let key;
        if (prev.cached) {
          key = `#${fixedArgs.toString()}`;
          if (prev.cached[key]) {
            this.discard().append(...prev.cached[key]);
            return true;
          }
        }
        if (target.body.some((x) => isBlock(x) && x.isRaw)) {
          if (this.descriptor === "Eval" || this.descriptor === "Fn") {
            this.env = new Env(this.env);
          }
          ctx = this.env;
          clean = target.body.length === 1 && isBlock(target.body[0]);
        }
        if (target.args && target.args.length === fixedArgs.length) {
          Env.merge(fixedArgs, target.args, clean, ctx);
        }
        const result = await Eval.do(target.body, ctx, `:${prev.getName() || ""}`, true, this.ctx.tokenInfo);
        if (key) {
          if (this.descriptor !== "Eval") {
            prev.cached[key] = result;
          } else {
            delete prev.cached;
          }
        }
        this.discard().append(...result);
      }
      return true;
    }
    const { name, args, body } = this.ctx.valueOf();
    if (this.ctx.isCallable) {
      if (name && body) {
        const call = !args && this.derive && DERIVE_METHODS.includes(this.descriptor) ? await Eval.do(body, this.env, "Fn", true, this.ctx.tokenInfo) : body;
        if (call[0].isCallable && call[0].hasArgs) {
          call[0].length = Expr.arity(call[0]);
          call[0].source = name;
        }
        this.env.defn(name, { args, body: call }, this.ctx.tokenInfo);
        this.registerNamespaceExport(name);
      } else {
        this.append(this.ctx);
      }
    } else {
      let fixedBody = args || body;
      if (args && this.ctx.tokenInfo && this.ctx.tokenInfo.value === "{") {
        fixedBody = Eval.normalizeBraceRecordArgs(args);
      }
      const derived = this.derive || fixedBody[0] && fixedBody[0].isObject;
      this.append(...await Eval.do(fixedBody, this.env, derived ? this.descriptor : "...", derived, this.ctx.tokenInfo));
    }
    return true;
  }
  async evalUnary() {
    const prev = this.getPrev();
    const older = this.getOlder();
    if (prev && prev.type === MINUS && !isNumber(this.getOlder())) {
      if (!isNumber(this.ctx)) {
        assert(this.ctx, false, NUMBER);
      }
      this.replace(Expr.value(this.ctx * -1, this.ctx.tokenInfo));
      return true;
    }
    if ((!prev || isEnd(prev)) && isOR(this.ctx)) {
      return true;
    }
    if (isNot(prev) && isResult(this.ctx)) {
      if (isLiteral(this.ctx)) {
        [this.ctx] = await Eval.do([this.ctx], this.env, "Expr", true, this.ctx.tokenInfo);
      }
      this.replace(Expr.value(!this.ctx.valueOf(), this.ctx.tokenInfo));
      return true;
    }
    if (isSome(this.ctx) && isResult(prev)) {
      const tag = Eval.getResultTagToken(prev);
      if (tag) {
        const payloadBody = prev.valueOf().value.getBody();
        if (tag.valueOf() === ":ok") {
          if (payloadBody.length === 1) {
            this.replace(payloadBody[0]);
          } else {
            this.replace(Expr.array(payloadBody));
          }
          this.move(Expr.chunk(this.expr, this.offset + 1).offset);
        } else {
          this.discard();
        }
        return true;
      }
    }
    if (isResult(prev) && isOR(this.ctx) && isObject(prev) && !isSome(older)) {
      const { body, offset } = Expr.chunk(this.expr, this.offset + 1);
      if (body.length) {
        const merged = await Eval.do(body, this.env, "Or", false, this.ctx.tokenInfo);
        if (merged.length === 1 && isObject(merged[0])) {
          this.discard().append(Expr.map({
            ...prev.valueOf(),
            ...merged[0].valueOf()
          }, this.ctx.tokenInfo));
          this.move(offset);
          return true;
        }
      }
    }
    if (isResult(prev) && (isOR(this.ctx) || isSome(this.ctx))) {
      if (isSome(this.ctx) ? !prev.valueOf() : prev.valueOf()) {
        this.move(Expr.chunk(this.expr, this.offset + 1).offset);
      } else {
        this.discard();
      }
      return true;
    }
  }
  async evalSymbols() {
    const prev = this.getPrev();
    const next = this.nextToken();
    if (isSymbol(this.ctx) && this.ctx.value === ":") {
      if (isBlock(next) || isString(next) && typeof next.value !== "string") {
        let [head2] = await Eval.do(next.getArgs() || next.valueOf(), this.env, "Sym", false, this.ctx.tokenInfo);
        if (!isScalar(head2)) {
          assert(head2, true, STRING, NUMBER, SYMBOL);
        }
        let token;
        if (head2.valueOf() === "nil")
          token = Expr.value(null, this.ctx.tokenInfo);
        if (head2.valueOf() === "on")
          token = Expr.value(true, this.ctx.tokenInfo);
        if (head2.valueOf() === "off")
          token = Expr.value(false, this.ctx.tokenInfo);
        const value = !isSymbol(head2) ? `:${head2.valueOf()}` : head2.valueOf();
        this.replace(token || Expr.symbol(value, false, this.ctx.tokenInfo), true).move();
      }
    }
    if (isArray(prev) && isData(prev.value[0]) && isSymbol(this.ctx)) {
      const value = prev.valueOf();
      const key = this.ctx.value.substr(1);
      this.discard();
      value.forEach((body) => {
        let result;
        if (isScalar(body) || isObject(body) || isArray(body)) {
          result = body.valueOf()[key];
        }
        if (typeof result !== "undefined") {
          this.append(!(result instanceof Expr) ? Expr.value(result) : result);
        }
      });
      return true;
    }
    if (this.key || isSymbol(prev) && isResult(this.ctx)) {
      if (isObject(prev) && isComma(this.ctx)) {
        if (isObject(prev) && isObject(next)) {
          Object.assign(prev.value, next.value);
          this.move();
        } else if (isSymbol(next))
          this.key = next.value.substr(1);
        return true;
      }
      if (!this.key) {
        const key = prev.value.substr(1);
        this.replace(Expr.map({
          [key]: Expr.body([this.ctx], this.ctx.tokenInfo)
        }, prev.tokenInfo));
        if (!(isEOL(next) || isMath(next))) {
          this.key = key;
        }
      } else if (isSymbol(this.ctx) && isResult(next)) {
        this.key = this.ctx.value.substr(1);
        prev.valueOf()[this.key] = Expr.body([], this.ctx.tokenInfo);
      } else {
        if (isDot(this.ctx) || isPipe(this.ctx) || !isComma(this.ctx) && isEnd(this.ctx)) {
          this.key = null;
          return;
        }
        const target = prev.valueOf();
        if (!target[this.key]) {
          this.key = null;
          return;
        }
        target[this.key].push(this.ctx);
      }
      return true;
    }
    if (isNumber(prev) && this.ctx.type === MUL && (isLiteral(next) || isSymbol(next))) {
      let fixedToken = next;
      if (isLiteral(next) && this.env.has(next.value)) {
        const resolved = this.env.get(next.value);
        if (resolved && resolved.ctx) {
          fixedToken = resolved.ctx;
        }
      }
      if (fixedToken && fixedToken.type === SYMBOL) {
        const num = prev.valueOf();
        const kind = fixedToken.value;
        const retval = Env.register(num, kind.substr(1));
        if (isPlain2(retval)) {
          this.replace(Expr.unit(retval, this.ctx.tokenInfo)).move();
          return true;
        }
      }
    }
  }
  async evalStrings() {
    const prev = this.getPrev();
    const next = this.nextToken();
    if (isString(this.ctx) && typeof this.ctx.value !== "string" && !isMod(next)) {
      const result = await Eval.do(this.ctx.valueOf(), this.env, "Str", false, this.ctx.tokenInfo);
      this.replace(Expr.value(result.map((sub) => sub.value).join(""), this.ctx.tokenInfo), true);
      return;
    }
    if (isString(prev) && isMod(this.ctx)) {
      const { body, offset } = Expr.chunk(this.expr, this.offset + 1);
      const subTree = await Eval.do(body, this.env, "Str", false, this.ctx.tokenInfo);
      if (typeof prev.value !== "string") {
        if (subTree.length > 1 || !isObject(subTree[0])) {
          check(body[0], "map");
        }
        this.discard().append(...await Eval.do(prev.valueOf(), Env.create(subTree[0].valueOf(), this.env), "Str", false, this.ctx.tokenInfo));
      } else {
        let isHead = subTree.length === 1;
        if (isHead) {
          if (isObject(subTree[0]) || !(isBlock(body[0]) || isRange(body[0]))) {
            check(body[0], "block or list");
          }
          isHead = isBlock(subTree[0]) || isRange(subTree[0]);
        }
        let inc = 0;
        const source = isHead ? subTree[0].getArgs() || subTree[0].valueOf() : subTree;
        const values = await Eval.do(source, this.env, "Str", false, next.tokenInfo);
        const newValue = prev.value.replace(/{(\d+)?}/g, (_, idx) => {
          const fixedValue = typeof idx !== "undefined" ? values[idx] : values[inc++];
          if (typeof fixedValue === "undefined") {
            raise(`Missing argument #${idx || inc}`, next.tokenInfo);
          }
          if (fixedValue.valueOf() === null)
            return ":nil";
          if (fixedValue.valueOf() === true)
            return ":on";
          if (fixedValue.valueOf() === false)
            return ":off";
          return fixedValue.valueOf();
        });
        this.replace(Expr.value(newValue));
      }
      this.move(offset);
      return true;
    }
  }
  async walk(descriptor) {
    if (Eval.detail && Eval.detail.enabled) {
      Eval.detail.calls.push([descriptor, Eval.detail.depth, this.expr]);
    }
    return this.execute(descriptor, async () => {
      if (!(this.ctx instanceof Expr)) {
        raise(`Given \`${JSON.stringify(this.ctx)}\` as token!`);
      }
      if (!this.ctx.tokenInfo || (typeof this.ctx.tokenInfo.line === "undefined" || typeof this.ctx.tokenInfo.col === "undefined")) {
        if (isResult(this.ctx))
          raise(`Given \`${JSON.stringify(this.ctx.tokenInfo)}\` as tokenInfo!`);
      }
      if (this.ctx.isObject) {
        const prev = this.getPrev();
        if (prev && !(isEnd(prev) || isResult(prev)))
          check(prev);
        this.append(...await Eval.map(this.ctx, descriptor, this.env, this.ctx.tokenInfo, this));
        return;
      }
      if (await this.evalUnary() || await this.evalTags() || await this.evalSymbols() || await this.evalStrings() || await this.evalDotProps() || await this.evalRangeSets() || await this.evalInfixCalls() || isBlock(this.ctx) && await this.evalBlocks() || this.ctx.isExpression && await this.evalLogic() || isLiteral(this.ctx) && typeof this.ctx.value === "string" && this.ctx.value !== "_" && await this.evalLiterals())
        return;
      if (isString(this.ctx) && typeof this.ctx.value === "string") {
        this.ctx.value = this.ctx.value.replace(/\\r/g, "\r");
        this.ctx.value = this.ctx.value.replace(/\\n/g, `
`);
        this.ctx.value = this.ctx.value.replace(/\\t/g, "\t");
      }
      this.append(this.ctx);
    });
  }
  async run(descriptor, tokenInfo) {
    let tokens = await this.walk(descriptor);
    tokens = Eval.math(OPS_MUL_DIV, tokens, tokenInfo);
    tokens = Eval.math(OPS_PLUS_MINUS_MOD, tokens, tokenInfo);
    tokens = Eval.walk(OPS_LOGIC, tokens, (left, op, right) => Eval.logic(op.type, left, right, tokenInfo));
    return tokens.filter((x) => ![EOL, COMMA].includes(x.type));
  }
  static info(defaults) {
    Eval.detail = defaults;
    return defaults;
  }
  static wrap(self2) {
    return async (fn, args, label) => {
      if (fn.length > args.length) {
        raise(`Missing arguments to call \`${fn.getName()}\``, self2.ctx.tokenInfo);
      }
      try {
        const scope = new Env(self2.env);
        Env.merge(args, fn.getArgs(), false, scope);
        const [value] = await Eval.do(fn.getBody(), scope, label, false, self2.ctx.tokenInfo);
        return value ? Expr.plain(value, self2.convert, `<${fn.name || "Function"}>`) : undefined;
      } catch (e) {
        raise(e.message.replace(/\sat line.*$/, ""), self2.ctx.tokenInfo);
      }
    };
  }
  static math(ops, expr, tokenInfo) {
    return Eval.walk(ops, expr, (left, op, right) => {
      let result;
      if (op.type === PLUS) {
        assert(left, true, STRING, NUMBER, SYMBOL);
        assert(right, true, STRING, NUMBER, SYMBOL);
      } else {
        assert(left, true, NUMBER);
        assert(right, true, NUMBER);
      }
      if (isUnit(left) || isUnit(right)) {
        let method;
        switch (op.type) {
          case PLUS:
            method = "add";
            break;
          case MINUS:
            method = "sub";
            break;
          case DIV:
            method = "div";
            break;
          case MUL:
            method = "mul";
            break;
          case MOD:
            method = "mod";
            break;
        }
        if (isUnit(left)) {
          try {
            const kind = (isUnit(right) ? right : left).value.kind;
            result = left.value[method](right.value, kind);
            if (typeof result !== "undefined") {
              return Expr.unit(result, tokenInfo);
            }
          } catch (e) {
            raise(`Failed to call \`${method}\` (${e.message})`);
          }
        }
        right = right.valueOf();
      }
      switch (op.type) {
        case PLUS:
          if (isSymbol(left))
            left = left.valueOf().substr(1);
          if (isSymbol(right))
            right = right.valueOf().substr(1);
          result = left + right;
          break;
        case MINUS:
          result = left - right;
          break;
        case DIV:
          result = left / right;
          break;
        case MUL:
          result = left * right;
          break;
        case MOD:
          result = left % right;
          break;
      }
      return Expr.value(result, tokenInfo);
    });
  }
  static logic(op, left, right, tokenInfo) {
    let result;
    switch (op) {
      case NOT_EQ:
        result = left.type !== right.type || hasDiff(left, right);
        break;
      case EXACT_EQ:
        result = left.type === right.type && !hasDiff(left, right);
        break;
      case EQUAL:
        result = !hasDiff(left, right, true);
        break;
      case LIKE:
        result = hasIn(left, right);
        break;
      case NOT:
        result = hasDiff(left, right, true);
        break;
      case LESS:
        result = left < right;
        break;
      case LESS_EQ:
        result = left <= right;
        break;
      case GREATER:
        result = left > right;
        break;
      case GREATER_EQ:
        result = left >= right;
        break;
    }
    return Expr.value(result, tokenInfo);
  }
  static walk(ops, expr, callback) {
    if (expr.length < 3)
      return expr;
    const output = [expr[0]];
    for (let i = 1, c = expr.length;i < c; i++) {
      const op = expr[i];
      if (op && ops.has(op.type) && i + 1 < c) {
        const left = output.pop();
        const right = expr[++i];
        output.push(callback(left, op, right));
      } else {
        output.push(op);
      }
    }
    return output;
  }
  static async loop(body, value, environment, parentTokenInfo) {
    const source = await Eval.do(value, environment, "Loop", false, parentTokenInfo);
    let scope = environment;
    let target = false;
    if (isLiteral(body[0])) {
      target = isBlock(body[1]) || isLiteral(body[1]) ? body.shift() : body[0];
      if (isString(body[1]) && Array.isArray(body[1].value)) {
        body = body[1].valueOf();
      }
    }
    if (isBlock(body[0]) && body[0].isCallable) {
      target = body[0].getArg(0);
      body = body[0].getBody();
    }
    if (target) {
      if (!(environment.has(target.value, true) && body.length === 1)) {
        scope = new Env(environment);
      } else {
        target = null;
      }
    }
    return Range.unwrap(source, (token) => {
      if (target) {
        scope.def(target.value, token);
      }
      if (target === null) {
        return Eval.run(body.concat(Expr.block({ args: [token] }, token.tokenInfo)), scope, "It", true, parentTokenInfo);
      }
      return body.length ? Eval.run(body, scope, "It", true, parentTokenInfo) : [token];
    });
  }
  static async map(token, descriptor, environment, parentTokenInfo, state) {
    const { value } = token;
    const subTree = [];
    let isDone2;
    if (value.let instanceof Expr.LetStatement) {
      subTree.push(...await Eval.do(value.let.getBody(), environment, "Let", true, parentTokenInfo));
      isDone2 = true;
    }
    if (value.destructure instanceof Expr.DestructureStatement) {
      const [bindingsToken, bodyToken] = value.destructure.getBody();
      const bindings = bindingsToken && bindingsToken.value || [];
      const source = await Eval.do(bodyToken.getBody(), environment, "Let", true, parentTokenInfo);
      let values = source;
      if (source.length === 1) {
        if (isArray(source[0])) {
          values = source[0].value;
        } else if (isRange(source[0])) {
          const expanded = await source[0].value.run(true);
          values = expanded.value;
        }
      }
      const restIndex = bindings.findIndex((binding) => binding.rest === true);
      const minRequired = restIndex === -1 ? bindings.length : restIndex;
      if (values.length < minRequired) {
        raise(`Expecting at least ${minRequired} values to destructure, given ${values.length}`, parentTokenInfo);
      }
      bindings.forEach((binding, index) => {
        if (binding.name === "_")
          return;
        const token2 = binding.rest ? Expr.array(values.slice(index), parentTokenInfo) : values[index];
        environment.def(binding.name, token2 || Expr.value(null, parentTokenInfo));
      });
      isDone2 = true;
    }
    if (value.do instanceof Expr.DoStatement && !(value.while instanceof Expr.WhileStatement)) {
      const scope = new Env(environment);
      const result = await Eval.do(value.do.getBody(), scope, "Do", true, parentTokenInfo);
      if (result.length) {
        subTree.push(result[result.length - 1]);
      }
      isDone2 = true;
    }
    if (value.if instanceof Expr.IfStatement) {
      const { body } = value.if.value;
      for (let i = 0, c = body.length;i < c; i++) {
        const [head2, ...tail2] = body[i].getBody();
        const [result] = await Eval.do([head2], environment, "If", true, parentTokenInfo);
        if (result.value === true) {
          subTree.push(...await Eval.do(tail2, environment, "Then", true, parentTokenInfo));
          break;
        }
        if (result.value === false && value.else instanceof Expr.Statement) {
          subTree.push(...await Eval.do(value.else.getBody(), environment, "Else", true, parentTokenInfo));
          break;
        }
      }
      isDone2 = true;
    }
    if (value.namespace instanceof Expr.NamespaceStatement) {
      const [nameToken, levelToken] = value.namespace.getBody();
      const name = nameToken && nameToken.valueOf && nameToken.valueOf() || "";
      const level = levelToken && levelToken.valueOf && levelToken.valueOf() || 1;
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
        raise(`Invalid namespace \`${name}\``, parentTokenInfo);
      }
      if (state && typeof state.enterNamespace === "function") {
        state.enterNamespace(name, Math.max(1, parseInt(level, 10) || 1), parentTokenInfo);
      }
      isDone2 = true;
    }
    if (value.table instanceof Expr.TableStatement) {
      const [metaToken] = value.table.getBody();
      const meta = metaToken && metaToken.valueOf && metaToken.valueOf() || {};
      const headers = Array.isArray(meta.headers) ? meta.headers : [];
      const rows = Array.isArray(meta.rows) ? meta.rows : [];
      const items2 = rows.map((row) => {
        const entry = {};
        headers.forEach((header, i) => {
          entry[header] = Expr.body([Eval.tableCellToken(row[i], parentTokenInfo)], parentTokenInfo);
        });
        return Expr.map(entry, parentTokenInfo);
      });
      subTree.push(Expr.array(items2, parentTokenInfo));
      isDone2 = true;
    }
    if (value.ok instanceof Expr.OkStatement) {
      subTree.push(await Eval.buildResultToken("ok", value.ok.getBody(), environment, parentTokenInfo));
      isDone2 = true;
    }
    if (value.err instanceof Expr.ErrStatement) {
      subTree.push(await Eval.buildResultToken("err", value.err.getBody(), environment, parentTokenInfo));
      isDone2 = true;
    }
    if (value.loop instanceof Expr.LoopStatement) {
      const body = value.loop.getBody();
      for (let i = 0, c = body.length;i < c; i++) {
        let range;
        let args;
        if (isBlock(body[i])) {
          if (isBlock(body[i].head())) {
            const [head2, ...tail2] = body[i].getBody();
            range = [head2];
            args = tail2;
          } else {
            range = body[i].getBody();
            args = [];
          }
        } else {
          range = [body[i]];
          args = [];
        }
        subTree.push(...await Eval.loop(args, range, environment, parentTokenInfo));
      }
      isDone2 = true;
    }
    if (value.match instanceof Expr.MatchStatement) {
      const fixedMatches = value.match.clone().getBody();
      const fixedBody = value.match.head().value.body;
      const fixedArgs = isBlock(fixedBody[0]) ? fixedBody[0].getArgs() : [fixedBody[0]];
      const [input] = await Eval.do(fixedArgs, environment, "Expr", true, parentTokenInfo);
      fixedMatches[0].value.body.shift();
      let cases = fixedMatches.map((x) => isBlock(x) ? x.getBody() : [x]);
      if (cases.length === 1 && cases[0].some(isComma)) {
        cases = Eval.splitMatchCases(cases[0]);
      }
      cases = cases.map((entry) => {
        if (entry.length !== 1)
          return entry;
        const [head2] = entry;
        if (isObject(head2) && head2.value && head2.value.else instanceof Expr.ElseStatement) {
          return [head2.value.else];
        }
        return entry;
      });
      const found = await Eval.resolveMatchBody(input, cases, environment, parentTokenInfo);
      if (found) {
        subTree.push(...await Eval.do(found, environment, "It", true, parentTokenInfo));
      }
      if (!found && value.else instanceof Expr.Statement) {
        subTree.push(...await Eval.do(value.else.getBody(), environment, "Else", true, parentTokenInfo));
      }
      isDone2 = true;
    }
    if (value.try instanceof Expr.TryStatement || value.rescue instanceof Expr.RescueStatement) {
      const body = (value.try || value.rescue).getBody();
      while (!isDone2) {
        let result;
        let failure;
        try {
          result = await Eval.do(body, environment, "Try", true, parentTokenInfo);
        } catch (e) {
          if (!value.rescue)
            throw e;
          failure = e;
        }
        if (value.check instanceof Expr.CheckStatement) {
          const [retval] = await Eval.do(value.check.getBody(), environment, "Check", true, parentTokenInfo);
          if (retval && retval.value === true)
            isDone2 = true;
        }
        if (!isDone2 && value.rescue instanceof Expr.RescueStatement) {
          let scope = environment;
          let retry;
          if (failure && value.try) {
            const subBody = value.rescue.getBody();
            for (let i = 0, c = subBody.length;!isDone2 && i < c; i++) {
              let fixedBody = isBlock(subBody[i]) ? subBody[i].getBody() : [subBody[i]];
              let newBody = [];
              let head2 = [];
              if (fixedBody[0].isCallable) {
                if (fixedBody[0].hasArgs) {
                  if (fixedBody[0].getArgs().length > 1) {
                    check(fixedBody[0].getArg(1), "block");
                  }
                  scope = new Env(environment);
                  scope.def(fixedBody[0].getArg(0).value, Expr.value(failure.toString()));
                }
                fixedBody = fixedBody[0].getBody();
              }
              if (isBlock(fixedBody[0]) && fixedBody[0].hasArgs) {
                head2 = fixedBody[0].getArgs(0);
                newBody = fixedBody.slice(1);
                if (!fixedBody[0].getArg(0).isExpression) {
                  newBody = newBody[0].getArgs();
                }
              }
              const [retval] = await Eval.do(head2, environment, "Expr", true, parentTokenInfo);
              if (retval && retval.value === true) {
                subTree.push(...await Eval.do(newBody, environment, "Rescue", true, parentTokenInfo));
                retry = true;
              }
              if (!isDone2 && !isBlock(fixedBody[0])) {
                subTree.push(...await Eval.do(fixedBody, environment, "Rescue", true, parentTokenInfo));
                isDone2 = true;
              }
            }
          }
          if (!retry)
            isDone2 = true;
          if (!failure && result) {
            subTree.push(...result);
            isDone2 = true;
          }
        }
      }
      isDone2 = true;
    }
    if (value.while instanceof Expr.WhileStatement) {
      const body = value.while.getBody();
      const head2 = body[0].getBody().shift();
      let enabled = true;
      if (value.do instanceof Expr.DoStatement) {
        do {
          subTree.push(...await Eval.do(value.do.getBody(), environment, "It", true, parentTokenInfo));
          if ((await Eval.do([head2], environment, "Do", true, parentTokenInfo))[0].value !== true)
            break;
        } while (enabled);
        enabled = false;
      }
      while (enabled) {
        if ((await Eval.do([head2], environment, "While", true, parentTokenInfo))[0].value !== true)
          break;
        subTree.push(...await Eval.do(body, environment, "It", true, parentTokenInfo));
      }
      isDone2 = true;
    }
    if (value.import instanceof Expr.ImportStatement) {
      if (!(value.from instanceof Expr.FromStatement)) {
        raise(`Missing \`@from\` for \`${token}\``);
      }
      only(value.from, isString);
      await Promise.all(Expr.each(value.import.getBody(), (ctx, name, alias) => {
        return Env.load(ctx, name, alias, value.from.head().valueOf(), environment);
      }));
      const templateSpec = Eval.templateImportSpec(value.template);
      if (templateSpec.hasTemplateImport) {
        const sourceName = value.from.head().valueOf();
        const source = await Env.resolve(sourceName, "@template", null, environment);
        if (!(source instanceof Env)) {
          raise(`Cannot import templates from \`${sourceName}\``, parentTokenInfo);
        }
        const exported = source.exportedTemplates || {};
        const names = templateSpec.includeAll ? Object.keys(exported) : templateSpec.names;
        names.forEach((requestedName) => {
          const exportedName = exported[requestedName];
          if (!templateSpec.includeAll && !exportedName) {
            raise(`Template \`${requestedName}\` not exported`, parentTokenInfo);
          }
          const realName = exportedName || requestedName;
          const definition = Eval.resolveTemplateByName(source.templates, realName);
          if (!definition) {
            raise(`Missing template \`${realName}\` in \`${sourceName}\``, parentTokenInfo);
          }
          Eval.registerTemplateByName(environment.templates, realName, definition);
        });
      }
      isDone2 = true;
    }
    if (value.module instanceof Expr.ModuleStatement || value.export instanceof Expr.ExportStatement) {
      if (value.module) {
        if (environment.descriptor) {
          raise(`Module name \`${environment.descriptor}\` is already set`);
        }
        only(value.module, isString);
        environment.descriptor = value.module.head().valueOf();
      }
      if (value.export) {
        if (environment.exported === true) {
          environment.exported = {};
        }
        Expr.each(value.export.getBody(), (ctx, name, alias) => {
          if (environment.exported[alias || name]) {
            raise(`Export for \`${alias || name}\` already exists`);
          }
          environment.exported[alias || name] = name;
        });
        if (value.template instanceof Expr.TemplateStatement) {
          const names = value.template.getBody().map(Eval.templateNameFromEntry).filter(Boolean);
          names.forEach((name) => {
            if (environment.exportedTemplates[name]) {
              raise(`Template export for \`${name}\` already exists`);
            }
            if (!Eval.resolveTemplateByName(environment.templates, name)) {
              raise(`Missing template \`${name}\``, parentTokenInfo);
            }
            environment.exportedTemplates[name] = name;
          });
        }
      }
      isDone2 = true;
    }
    if (!isDone2 && (value.do instanceof Expr.DoStatement || value.from instanceof Expr.FromStatement || value.else instanceof Expr.ElseStatement || value.check instanceof Expr.CheckStatement || value.rescue instanceof Expr.RescueStatement))
      check(token);
    if (!subTree.length && !isDone2) {
      if (["Set", "Call", "Match"].includes(descriptor)) {
        const keys2 = Object.keys(value);
        for (let i = 0, c = keys2.length;i < c; i++) {
          const subBody = value[keys2[i]].getBody();
          const fixedBody = await Eval.do(subBody, environment, "Prop", true, parentTokenInfo);
          value[keys2[i]] = Expr.stmt(fixedBody, parentTokenInfo);
        }
      }
      return [Expr.map(value, token.tokenInfo)];
    }
    return subTree;
  }
  static async run(tokens, environment, descriptor, noInheritance, parentTokenInfo) {
    if (Eval.detail)
      Eval.detail.depth++;
    try {
      if (!Array.isArray(tokens)) {
        raise(`Given \`${JSON.stringify(tokens)}\` as input!`);
      }
      const vm = new Eval(tokens, environment, noInheritance);
      const result = await vm.run(descriptor, parentTokenInfo);
      return result;
    } finally {
      if (Eval.detail)
        Eval.detail.depth--;
    }
  }
  static do(params, ...args) {
    if (Array.isArray(params)) {
      return !(params.length === 1 && isNumber(params[0])) ? Eval.run(params, ...args) : params;
    }
    return Object.keys(params).reduce((prev, cur) => prev.then((target) => {
      return Eval.run(params[cur], ...args).then((result) => {
        target[cur] = result;
        return target;
      });
    }), Promise.resolve({}));
  }
}

// src/lib/index.js
var builtinsReady = false;
function ensureBuiltins() {
  if (builtinsReady)
    return;
  builtinsReady = true;
  const mappings = ensureDefaultMappings();
  Expr.Unit.to = Parser.sub("(a b) -> a.to(b)");
  Object.keys(mappings).forEach((kind) => {
    Expr.Unit[kind] = Parser.sub(`:${mappings[kind]}`);
  });
}
async function evaluate(tokens, environment, enabledDetail) {
  ensureBuiltins();
  const info = Eval.info({
    enabled: enabledDetail,
    depth: 0,
    calls: []
  });
  let result;
  let error;
  try {
    result = await Eval.run(tokens, environment, "Eval", !!environment);
  } catch (e) {
    if (!environment)
      throw e;
    error = e;
  }
  return { result, error, info };
}
async function execute(code, environment, enabledDetail) {
  ensureBuiltins();
  let failure = null;
  let value = null;
  let info = {};
  try {
    const res = await evaluate(Parser.getAST(code, "parse", environment), environment, enabledDetail);
    failure = res.error;
    value = res.result;
    info = res.info;
  } catch (e) {
    failure = failure || e;
  }
  execute.failure = failure;
  execute.value = value;
  execute.info = info;
  if (failure && !environment) {
    throw failure;
  }
  return value;
}

// src/adapters/index.js
function applyAdapter(runtime, adapter, options = {}) {
  if (!adapter)
    return;
  if (typeof adapter.setup === "function") {
    adapter.setup(runtime, options);
  }
}
// src/compiler/index.js
var OPERATOR = new Map([
  [PLUS, "+"],
  [MINUS, "-"],
  [MUL, "*"],
  [DIV, "/"],
  [MOD, "%"],
  [EQUAL, "==="],
  [LESS, "<"],
  [LESS_EQ, "<="],
  [GREATER, ">"],
  [GREATER_EQ, ">="],
  [NOT_EQ, "!="],
  [EXACT_EQ, "==="],
  [OR, "||"],
  [LIKE, "~"],
  [PIPE, "|>"]
]);
// src/runtime/core.js
var SIGNAL = Symbol("10x.signal");
var currentEffect = null;
var globalRegistry = (() => {
  if (!globalThis.__10x_signals) {
    globalThis.__10x_signals = new Map;
  }
  return globalThis.__10x_signals;
})();
function isSignal(value) {
  return !!(value && value[SIGNAL]);
}
function read(value) {
  return isSignal(value) ? value.get() : value;
}
function effect(fn) {
  const run = () => {
    currentEffect = run;
    try {
      fn();
    } finally {
      currentEffect = null;
    }
  };
  run();
  return run;
}
function getSignalRegistry() {
  return globalRegistry;
}
// src/runtime/dom.js
var componentObservers = new WeakMap;
// src/runtime/devtools.js
function renderRows(container, registry) {
  const entries = Array.from(registry.entries());
  container.innerHTML = "";
  entries.forEach(([name, signal]) => {
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr auto auto";
    row.style.gap = "0.6rem";
    row.style.padding = "0.25rem 0";
    row.style.borderBottom = "1px solid rgba(255,255,255,0.08)";
    const key = document.createElement("code");
    key.textContent = String(name);
    const value = document.createElement("code");
    value.textContent = JSON.stringify(read(signal));
    const subs = document.createElement("code");
    subs.textContent = `subs:${signal.subs ? signal.subs.size : 0}`;
    row.appendChild(key);
    row.appendChild(value);
    row.appendChild(subs);
    container.appendChild(row);
  });
}
function devtools() {
  if (typeof document === "undefined")
    return null;
  let panel = document.getElementById("10x-devtools-panel");
  if (panel)
    return panel;
  const registry = getSignalRegistry();
  panel = document.createElement("aside");
  panel.id = "10x-devtools-panel";
  panel.style.position = "fixed";
  panel.style.bottom = "1rem";
  panel.style.right = "1rem";
  panel.style.width = "360px";
  panel.style.maxHeight = "45vh";
  panel.style.overflow = "auto";
  panel.style.zIndex = "99999";
  panel.style.padding = "0.7rem";
  panel.style.borderRadius = "12px";
  panel.style.border = "1px solid rgba(255,255,255,0.15)";
  panel.style.background = "rgba(12,16,22,0.94)";
  panel.style.color = "#d8dde4";
  panel.style.font = "12px/1.4 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  const title = document.createElement("div");
  title.textContent = "10x DevTools · Signals";
  title.style.fontWeight = "700";
  title.style.marginBottom = "0.5rem";
  const body = document.createElement("div");
  panel.appendChild(title);
  panel.appendChild(body);
  document.body.appendChild(panel);
  effect(() => {
    renderRows(body, registry);
  });
  return panel;
}
function devtoolsEnabledByQuery(search) {
  const input = typeof search === "string" ? search : typeof window !== "undefined" && window.location ? window.location.search : "";
  if (!input)
    return false;
  const params = new URLSearchParams(input.startsWith("?") ? input : `?${input}`);
  if (!params.has("devtools"))
    return false;
  const value = params.get("devtools");
  return value !== "0" && value !== "false" && value !== "off";
}
function maybeEnableDevtools() {
  if (typeof document === "undefined" || typeof window === "undefined")
    return null;
  if (!devtoolsEnabledByQuery(window.location && window.location.search))
    return null;
  const start = () => {
    try {
      devtools();
    } catch (_) {}
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
    return null;
  }
  return start();
}
maybeEnableDevtools();
// src/lib/ansi.js
var CODES = {
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  redBright: [91, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  cyanBright: [96, 39],
  bgRedBright: [101, 49]
};
function style(open, close) {
  return (value) => `\x1B[${open}m${value}\x1B[${close}m`;
}
var ansi = {};
var names = Object.keys(CODES);
names.forEach((name) => {
  const [open, close] = CODES[name];
  ansi[name] = style(open, close);
});
names.forEach((first) => {
  names.forEach((second) => {
    ansi[first][second] = (value) => ansi[first](ansi[second](value));
  });
});
// src/main.js
function applyAdapter2(adapter, options) {
  applyAdapter({
    Env,
    Expr,
    execute,
    evaluate
  }, adapter, options);
}

// src/adapters/browser/index.js
function createBrowserAdapter() {
  const safeUnits = [];
  return {
    name: "browser",
    setup({ Env: Env2, Expr: Expr2 }) {
      Env2.register = (num, kind) => {
        if (typeof num === "function") {
          safeUnits.push(num);
          return;
        }
        for (let i = 0;i < safeUnits.length; i++) {
          const result = safeUnits[i](num, kind);
          if (result)
            return result;
        }
        return Expr2.Unit.from(num, kind);
      };
      Env2.shared = Env2.shared || {};
    }
  };
}

// src/editor/editor-eval-worker.js
applyAdapter2(createBrowserAdapter());
var SYMBOL_NAME = (sym) => {
  if (!sym || typeof sym !== "symbol")
    return "";
  return sym.toString().match(/Symbol\((.+)\)/)?.[1] ?? "";
};
function inferTokenType(token) {
  if (!token)
    return "unknown";
  if (token.isCallable || token.isFunction)
    return "fn";
  if (token.isTag)
    return "tag";
  if (token.isObject) {
    const shape = token.valueOf ? token.valueOf() : token.value;
    if (shape && typeof shape === "object" && shape.__tag && shape.value)
      return "result";
    return "record";
  }
  if (token.isRange)
    return Array.isArray(token.value) ? "list" : "range";
  if (token.isNumber)
    return "number";
  if (token.isString)
    return "string";
  if (token.isSymbol)
    return "symbol";
  const symbol = SYMBOL_NAME(token.type);
  return symbol ? symbol.toLowerCase() : "unknown";
}
function inferRuntimeType(value) {
  if (value === null)
    return "nil";
  if (value === undefined)
    return "unknown";
  if (typeof value === "number")
    return "number";
  if (typeof value === "string")
    return "string";
  if (typeof value === "boolean")
    return "boolean";
  if (typeof value === "function")
    return "fn";
  if (Array.isArray(value)) {
    if (!value.length)
      return "list<unknown>";
    if (value.length === 1)
      return inferRuntimeType(value[0]);
    const sample = value.find(Boolean);
    const inner = sample ? inferRuntimeType(sample) : "unknown";
    return `list<${inner}>`;
  }
  if (value && typeof value === "object" && typeof value.type === "symbol") {
    return inferTokenType(value);
  }
  if (value && typeof value === "object") {
    if (value.__tag && value.value)
      return "result";
    return "record";
  }
  return "unknown";
}
function isFunctionDefinitionSource(source) {
  const normalized = String(source || "").replace(/\s+/g, " ").trim();
  return /^[^=]+=\s*.*->/.test(normalized);
}
function extractInlineExpressions(source, statementId = "") {
  const text = String(source || "");
  const expressions = [];
  const re = /#\{([^{}]+)\}/g;
  let match;
  let index = 0;
  while (match = re.exec(text)) {
    index += 1;
    expressions.push({
      inlineId: `${statementId}:${index}`,
      expr: match[1].trim()
    });
  }
  return expressions;
}
self.addEventListener("message", async ({ data }) => {
  const { requestId, statements, skipStatementIds } = data || {};
  if (!requestId)
    return;
  try {
    if (!Array.isArray(statements) || !statements.length) {
      self.postMessage({ requestId, done: true });
      return;
    }
    const env = new Env;
    const skipped = new Set(Array.isArray(skipStatementIds) ? skipStatementIds : []);
    for (const statement of statements) {
      if (!statement?.statementId || !statement?.source?.trim()) {
        continue;
      }
      if (skipped.has(statement.statementId))
        continue;
      self.postMessage({
        requestId,
        statementId: statement.statementId,
        start: true
      });
      const partial = {
        requestId,
        statementId: statement.statementId,
        completed: true
      };
      try {
        const result = await execute(statement.source, env);
        if (isFunctionDefinitionSource(statement.source)) {
          partial.statementResult = {
            statementId: statement.statementId,
            resultText: "ƒ",
            kind: "function",
            typeText: "fn"
          };
        } else if (result !== undefined && result !== null) {
          partial.statementResult = {
            statementId: statement.statementId,
            resultText: serialize(result),
            typeText: inferRuntimeType(result)
          };
        }
        const inlineResults = [];
        const inlineExpressions = extractInlineExpressions(statement.source, statement.statementId);
        for (const inline of inlineExpressions) {
          if (!inline.expr)
            continue;
          try {
            const inlineResult = await execute(inline.expr, env);
            if (inlineResult === undefined || inlineResult === null)
              continue;
            inlineResults.push({
              inlineId: inline.inlineId,
              resultText: serialize(inlineResult),
              typeText: inferRuntimeType(inlineResult)
            });
          } catch (error) {
            inlineResults.push({
              inlineId: inline.inlineId,
              resultText: "!",
              errorText: String(error?.message || error)
            });
          }
        }
        if (inlineResults.length) {
          partial.inlineResults = inlineResults;
        }
      } catch (_) {}
      self.postMessage(partial);
    }
    self.postMessage({ requestId, done: true });
  } catch (error) {
    self.postMessage({ requestId, error: String(error?.message || error) });
  }
});
