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
  ":off",
  ":click",
  ":focus",
  ":blur",
  ":input",
  ":change",
  ":submit",
  ":load",
  ":error",
  ":mouseenter",
  ":mouseleave",
  ":mousedown",
  ":mouseup",
  ":mouseover",
  ":mouseout",
  ":keydown",
  ":keyup",
  ":keypress",
  ":touchstart",
  ":touchend",
  ":touchmove",
  ":touchcancel"
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
async function useCurrencies(opts, fromDate) {
  ensureCurrencyMappings();
  const today = fromDate || new Date().toISOString().substr(0, 10);
  const {
    key,
    read,
    write,
    exists,
    resolve
  } = opts;
  if (!exists(key) || read(key).date !== today) {
    write(key, JSON.stringify({
      ...await resolve(),
      date: today
    }));
  }
  Object.assign(CURRENCY_EXCHANGES, read(key).rates);
}

// node_modules/somedom/dist/somedom.mjs
var e = /^[0-9A-Za-z-]+$/;
var r = /^xlink:?/;
var i = "http://www.w3.org/1999/xlink";
var c = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
var a = (e2) => Array.isArray(e2);
var l = (e2) => typeof e2 == "string";
var u = (e2) => typeof e2 == "function";
var d = (e2) => e2 == null;
var f = (e2) => e2 !== null && Object.prototype.toString.call(e2) === "[object Object]";
var p = (e2) => e2 !== null && (typeof e2 == "function" || typeof e2 == "object");
var h = (e2) => l(e2) || typeof e2 == "number" || typeof e2 == "boolean";
var b = (e2) => e2 !== null && typeof e2 == "object" && ("value" in e2) && typeof e2.peek == "function";
function g(t) {
  return e.test(t);
}
function y(e2) {
  return !(!a(e2) || !u(e2[0])) || !!(e2 && a(e2) && g(e2[0])) && !!(f(e2[1]) && e2.length >= 2);
}
function v(e2) {
  return e2 === null || !u(e2) && (a(e2) ? e2.length === 0 : f(e2) ? Object.keys(e2).length === 0 : d(e2) || e2 === false);
}
var m = (e2) => a(e2) && !y(e2);
function _(e2) {
  if (y(e2) && f(e2[1]))
    return e2[1].key;
}
function E(e2) {
  if (e2.nodeType === 1)
    return e2.getAttribute("data-key") || undefined;
}
function N(e2, t) {
  if (typeof e2 != typeof t)
    return true;
  if (a(e2)) {
    if (!a(t) || e2.length !== t.length)
      return true;
    for (let n = 0;n < t.length; n += 1)
      if (N(e2[n], t[n]))
        return true;
  } else {
    if (!f(e2) || !f(t))
      return e2 !== t;
    {
      const n = Object.keys(e2).sort(), s = Object.keys(t).sort();
      if (N(n, s))
        return true;
      for (let r2 = 0;r2 < n.length; r2 += 1)
        if (N(e2[n[r2]], t[s[r2]]))
          return true;
    }
  }
}
function k(e2) {
  return e2.slice(2);
}
function x(e2) {
  return y(e2) ? e2 : a(e2) ? e2.reduce((e3, t) => e3.concat(y(t) ? [t] : x(t)), []) : v(e2) ? [] : [e2];
}
function D(e2) {
  return e2.attributes && !e2.getAttributeNames ? e2.attributes : e2.getAttributeNames().reduce((t, n) => (t[n.replace("data-", "@")] = e2[n] || e2.getAttribute(n), t), {});
}
function S(e2, t) {
  if (!d(e2)) {
    if (a(e2))
      return e2.map((e3) => S(e3, t));
    if (typeof NodeList != "undefined" && e2 instanceof NodeList)
      return S(e2.values(), t);
    if (e2.nodeType === 3)
      return e2.nodeValue;
    if (e2.nodeType === 1) {
      const n = [];
      return t && e2.childNodes.forEach((e3) => {
        n.push(S(e3, t));
      }), [e2.tagName.toLowerCase(), D(e2), n];
    }
    return e2.childNodes ? e2.childNodes.map((e3) => S(e3, t)) : S([...e2], t);
  }
}

class L {
  constructor() {
    this.childNodes = [], this.nodeType = 11;
  }
  appendChild(e2) {
    L.valid(e2) ? e2.childNodes.forEach((e3) => {
      this.appendChild(e3);
    }) : this.childNodes.push(e2);
  }
  mount(e2, t) {
    for (;this.childNodes.length > 0; ) {
      const n = this.childNodes.shift();
      t ? e2.insertBefore(n, t) : e2.appendChild(n);
    }
  }
  static valid(e2) {
    return e2 instanceof L;
  }
  static from(e2, t) {
    const n = new L;
    return t = t.filter((e3) => e3 !== null), n.vnode = t, t.forEach((t2) => {
      n.appendChild(e2(t2));
    }), n;
  }
}
var T = (e2) => e2.replace(/-([a-z])/g, (e3, t) => t.toUpperCase());
var U = (e2, t) => e2 && e2.removeChild(t);
var q = (e2, t) => {
  t && (L.valid(t) ? t.mount(e2.parentNode, e2) : e2.parentNode.insertBefore(t, e2)), U(e2.parentNode, e2);
};
var G = null;
var Q = new Set;
function ee(e2) {
  let t = null;
  const n = new Set, s = new Set;
  function r2() {
    typeof t == "function" && (t(), t = null), n.forEach((e3) => e3.delete(r2)), n.clear(), s.forEach((e3) => e3.subscribers.delete(r2)), s.clear();
    const i2 = G;
    G = r2, r2._deps = n, r2._signals = s;
    try {
      t = e2();
    } finally {
      G = i2;
    }
  }
  return r2._deps = n, r2._signals = s, r2(), function() {
    typeof t == "function" && t(), n.forEach((e3) => e3.delete(r2)), s.forEach((e3) => {
      e3.subscribers.delete(r2), e3.subscribers.size === 0 && e3.wasEmpty && e3.options?.onUnsubscribe && e3.options.onUnsubscribe();
    }), r2._externalDisposers && (r2._externalDisposers.forEach((e3) => e3()), r2._externalDisposers.clear());
  };
}
var se = "s:";
function re(e2) {
  return e2.indexOf(se) === 0;
}
function ie(e2) {
  return e2.indexOf("d:") === 0;
}
function oe(e2, t, n) {
  const s = t.slice(2);
  e2._signalDisposers || (e2._signalDisposers = new Map), e2._signalDisposers.has(t) && e2._signalDisposers.get(t)();
  const r2 = ee(() => {
    const t2 = n.value;
    s === "textContent" ? e2.textContent = t2 == null ? "" : String(t2) : s === "innerHTML" ? e2.innerHTML = t2 == null ? "" : String(t2) : s.startsWith("style.") ? e2.style[s.slice(6)] = t2 : e2[s] = t2;
  });
  if (!r2._deps?.size && typeof n.subscribe == "function") {
    const i2 = n.subscribe(() => {
      const t2 = n.peek();
      s === "textContent" ? e2.textContent = t2 == null ? "" : String(t2) : s === "innerHTML" ? e2.innerHTML = t2 == null ? "" : String(t2) : s.startsWith("style.") ? e2.style[s.slice(6)] = t2 : e2[s] = t2;
    }), o = r2;
    return void e2._signalDisposers.set(t, () => {
      o(), i2();
    });
  }
  e2._signalDisposers.set(t, r2);
}
function ce(e2) {
  e2._signalDisposers && (e2._signalDisposers.forEach((e3) => e3()), e2._signalDisposers.clear());
}
function ae(e2, t, n, s) {
  Object.entries(t).forEach(([t2, o]) => {
    if (t2 !== "key" && t2 !== "open")
      if (t2 === "ref")
        e2.oncreate = (e3) => {
          o.current = e3;
        };
      else if (t2 === "@html")
        e2.innerHTML = o;
      else if (re(t2)) {
        if (o && typeof o == "object" && "value" in o) {
          oe(e2, t2, o);
          const n2 = e2.teardown;
          e2.teardown = () => {
            ce(e2), n2 && n2();
          };
        }
      } else if (ie(t2)) {
        if (o && typeof o == "object" && "value" in o) {
          (function(e3, t3, n3) {
            const s2 = t3.slice(2);
            let r2;
            switch (e3._directiveDisposers || (e3._directiveDisposers = new Map), e3._directiveDisposers.has(t3) && e3._directiveDisposers.get(t3)(), s2) {
              case "show":
                if (r2 = ee(() => {
                  e3.style.display = n3.value ? "" : "none";
                }), !r2._deps?.size && typeof n3.subscribe == "function") {
                  const t4 = n3.subscribe(() => {
                    e3.style.display = n3.peek() ? "" : "none";
                  }), s3 = r2;
                  r2 = () => {
                    s3(), t4();
                  };
                }
                break;
              case "hide":
                if (r2 = ee(() => {
                  e3.style.display = n3.value ? "none" : "";
                }), !r2._deps?.size && typeof n3.subscribe == "function") {
                  const t4 = n3.subscribe(() => {
                    e3.style.display = n3.peek() ? "none" : "";
                  }), s3 = r2;
                  r2 = () => {
                    s3(), t4();
                  };
                }
                break;
              case "class": {
                const t4 = n3.className || "active";
                if (r2 = ee(() => {
                  e3.classList.toggle(t4, !!n3.value);
                }), !r2._deps?.size && typeof n3.subscribe == "function") {
                  const s3 = n3.subscribe(() => {
                    e3.classList.toggle(t4, !!n3.peek());
                  }), i2 = r2;
                  r2 = () => {
                    i2(), s3();
                  };
                }
                break;
              }
              case "model": {
                const t4 = n3, s3 = e3;
                s3.value = t4.value;
                const i2 = () => {
                  t4.value = s3.value;
                };
                s3.addEventListener("input", i2), r2 = ee(() => {
                  document.activeElement !== s3 && (s3.value = t4.value);
                }), r2._cleanup = () => {
                  s3.removeEventListener("input", i2);
                };
                break;
              }
              case "text":
                if (r2 = ee(() => {
                  e3.textContent = n3.value;
                }), !r2._deps?.size && typeof n3.subscribe == "function") {
                  const t4 = n3.subscribe(() => {
                    e3.textContent = n3.peek();
                  }), s3 = r2;
                  r2 = () => {
                    s3(), t4();
                  };
                }
                break;
              case "html":
                if (r2 = ee(() => {
                  e3.innerHTML = n3.value;
                }), !r2._deps?.size && typeof n3.subscribe == "function") {
                  const t4 = n3.subscribe(() => {
                    e3.innerHTML = n3.peek();
                  }), s3 = r2;
                  r2 = () => {
                    s3(), t4();
                  };
                }
                break;
              case "click-outside": {
                const t4 = n3, s3 = (n4) => {
                  e3.contains(n4.target) || t4(n4);
                };
                document.addEventListener("click", s3), r2 = () => document.removeEventListener("click", s3);
                break;
              }
              default:
                return;
            }
            e3._directiveDisposers.set(t3, r2);
          })(e2, t2, o);
          const n2 = e2.teardown;
          e2.teardown = () => {
            (function(e3) {
              e3._directiveDisposers && (e3._directiveDisposers.forEach((e4) => {
                e4._cleanup && e4._cleanup(), e4();
              }), e3._directiveDisposers.clear());
            })(e2), n2 && n2();
          };
        }
      } else if (t2.indexOf("class:") === 0)
        o ? e2.classList.add(t2.substr(6)) : e2.classList.remove(t2.substr(6));
      else if (t2.indexOf("style:") === 0)
        e2.style[T(t2.substr(6))] = o;
      else {
        const c2 = t2.replace("@", "data-").replace(r, "");
        if (b(o)) {
          oe(e2, `${se}${c2}`, o);
          const t3 = e2.teardown;
          return void (e2.teardown = () => {
            ce(e2), t3 && t3();
          });
        }
        let l2 = o !== true ? o : !!c2.includes("-") || c2;
        p(l2) && (l2 = u(s) && s(e2, c2, l2) || l2, l2 = l2 !== e2 ? l2 : null, l2 = a(l2) ? l2.join("") : l2);
        const d2 = v(l2);
        if (n && t2 !== c2)
          return void (d2 ? e2.removeAttributeNS(i, c2) : e2.setAttributeNS(i, c2, l2));
        d2 ? e2.removeAttribute(c2) : h(l2) && e2.setAttribute(c2, l2);
      }
  });
}

class le {
  constructor(e2) {
    this.target = l(e2) ? document.querySelector(e2) : e2, this.childNodes = [], this.nodeType = 11;
  }
  appendChild(e2) {
    this.childNodes.push(e2);
  }
  mount() {
    this.target && this.childNodes.forEach((e2) => {
      this.target.appendChild(e2);
    });
  }
  unmount() {
    this.childNodes.forEach((e2) => {
      e2.parentNode && e2.parentNode.removeChild(e2);
    }), this.childNodes = [];
  }
  static valid(e2) {
    return e2 instanceof le;
  }
  static from(e2, t, n) {
    const s = new le(n);
    return t.forEach((t2) => {
      s.appendChild(e2(t2));
    }), s;
  }
}
var ue = () => typeof Element != "undefined" && ("moveBefore" in Element.prototype);
function de(e2, t = (e3) => e3()) {
  const n = () => e2 && e2.remove();
  return t === false ? n() : Promise.resolve().then(() => t(n));
}
function fe(e2, t, n, s) {
  const r2 = pe(t, n, s);
  return le.valid(r2) ? r2.mount() : L.valid(r2) ? r2.mount(e2) : e2.appendChild(r2), r2;
}
function pe(e2, t, n) {
  if (d(e2))
    throw new Error(`Invalid vnode, given '${e2}'`);
  if (!y(e2))
    return a(e2) ? L.from((e3) => pe(e3, t, n), e2) : b(e2) ? function(e3) {
      const t2 = document.createTextNode(String(e3.peek())), n2 = ee(() => {
        t2.nodeValue = String(e3.value);
      });
      if (!n2._deps?.size && typeof e3.subscribe == "function") {
        const s2 = e3.subscribe(() => {
          t2.nodeValue = String(e3.peek());
        }), r3 = n2;
        return t2._signalDispose = () => {
          r3(), s2();
        }, t2;
      }
      return t2._signalDispose = n2, t2;
    }(e2) : h(e2) && document.createTextNode(String(e2)) || e2;
  if (!a(e2))
    return e2;
  if (n && n.tags && n.tags[e2[0]])
    return pe(n.tags[e2[0]](e2[1], k(e2), n), t, n);
  if (!y(e2))
    return L.from((e3) => pe(e3, t, n), e2);
  if (u(e2[0]))
    return pe(e2[0](e2[1], e2.slice(2)), t, n);
  if (e2[0] === "portal") {
    const [, s2, ...r3] = e2;
    return le.from((e3) => pe(e3, t, n), r3, s2.target);
  }
  const s = t || e2[0].indexOf("svg") === 0, [r2, i2, ...o] = e2;
  let c2 = s ? document.createElementNS("http://www.w3.org/2000/svg", r2) : document.createElement(r2);
  if (i2 && i2.key && c2.setAttribute("data-key", i2.key), u(n) && (c2 = n(c2, r2, i2, o) || c2), u(c2))
    return pe(c2(), s, n);
  v(i2) || ae(c2, i2, s, n), u(c2.oncreate) && c2.oncreate(c2), u(c2.enter) && c2.enter(), c2.remove = () => Promise.resolve().then(() => u(c2.ondestroy) && c2.ondestroy(c2)).then(() => u(c2.teardown) && c2.teardown()).then(() => u(c2.exit) && c2.exit()).then(() => q(c2)), o.forEach((e3) => {
    he(c2, e3, s, n);
  });
  const l2 = c2.childNodes;
  if (l2.length > 0) {
    const e3 = c2.teardown;
    c2.teardown = () => {
      for (let e4 = 0;e4 < l2.length; e4++) {
        const t2 = l2[e4];
        t2._signalDispose && t2._signalDispose();
      }
      e3 && e3();
    };
  }
  return c2;
}
function he(e2, t, n, s) {
  return u(t) && (s = t, t = e2, e2 = undefined), u(n) && (s = n, n = null), d(t) && (t = e2, e2 = undefined), e2 || (e2 = document.body), typeof e2 == "string" && (e2 = document.querySelector(e2)), m(t) ? t.forEach((t2) => {
    he(e2, t2, n, s);
  }) : d(t) || (e2 = fe(e2, t, n, s)), e2;
}
async function be(e2, t, n, s, r2) {
  return h(n) || !y(t) || t[0] !== n[0] || e2.nodeType !== 1 ? function(e3, t2, n2, s2) {
    if (u(e3.onreplace))
      return e3.onreplace(t2, n2, s2);
    const r3 = pe(t2, n2, s2);
    return le.valid(r3) ? (r3.mount(), e3.remove()) : L.valid(r3) ? q(e3, r3) : e3.replaceWith(r3), r3;
  }(e2, n, s, r2) : (function(e3, t2, n2, s2, r3) {
    let i2;
    const o = Object.keys(t2).concat(Object.keys(n2)).reduce((e4, s3) => ((s3 in t2) && !(s3 in n2) ? (e4[s3] = null, i2 = true) : N(t2[s3], n2[s3]) && (e4[s3] = n2[s3], i2 = true), e4), {});
    return i2 && (Object.keys(t2).forEach((t3) => {
      if (re(t3) && !(t3 in n2) && e3._signalDisposers && e3._signalDisposers.has(t3) && (e3._signalDisposers.get(t3)(), e3._signalDisposers.delete(t3)), ie(t3) && !(t3 in n2) && e3._directiveDisposers && e3._directiveDisposers.has(t3)) {
        const n3 = e3._directiveDisposers.get(t3);
        n3._cleanup && n3._cleanup(), n3(), e3._directiveDisposers.delete(t3);
      }
    }), ae(e3, o, s2, r3)), i2;
  }(e2, t[1] || [], n[1] || [], s, r2) && (u(e2.onupdate) && await e2.onupdate(e2), u(e2.update) && await e2.update()), n[1] && n[1]["@html"] ? e2 : ge(e2, k(t), k(n), s, r2));
}
async function ge(e2, t, n, s, r2) {
  if (!t || y(t) && y(n))
    return be(e2, t, n, s, r2);
  if (y(t)) {
    for (;a(n) && n.length === 1; )
      n = n[0];
    return ge(e2, [t], n, s, r2);
  }
  return y(n) ? be(e2, t, n, s, r2) : (await async function(e3, t2, n2, s2) {
    const r3 = [], i2 = x(t2), o = Math.max(e3.childNodes.length, i2.length), c2 = Array.from(e3.childNodes), a2 = new Map, l2 = new Set;
    for (let e4 = 0;e4 < c2.length; e4++) {
      const t3 = E(c2[e4]);
      t3 && a2.set(t3, { el: c2[e4], index: e4 });
    }
    let u2, f2, p2, h2 = 0;
    for (let t3 = 0;t3 < o; t3 += 1) {
      u2 !== h2 && (f2 = e3.childNodes[h2], p2 = S(f2), u2 = h2);
      const t4 = i2.shift(), n3 = _(t4);
      if (d(t4))
        r3.push({ rm: f2 }), u2 = null;
      else if (d(p2))
        if (n3 && a2.has(n3) && !l2.has(n3)) {
          const e4 = a2.get(n3).el, s3 = a2.get(n3).index;
          l2.add(n3), s3 < h2 ? (r3.push({ move: e4, target: f2 }), h2++) : (r3.push({ patch: S(e4), with: t4, target: e4 }), l2.add(n3));
        } else
          r3.push({ add: t4 }), h2++;
      else {
        const e4 = E(f2);
        if (n3 && n3 === e4 && !l2.has(n3))
          r3.push({ patch: p2, with: t4, target: f2 }), l2.add(n3), h2++;
        else if (n3 && a2.has(n3) && !l2.has(n3)) {
          const e5 = a2.get(n3).el;
          r3.push({ move: e5, target: f2 }), l2.add(n3), h2++;
        } else
          r3.push({ patch: p2, with: t4, target: f2 }), h2++;
      }
    }
    if (h2 !== e3.childNodes.length)
      for (let t3 = e3.childNodes.length;t3 > h2; t3--) {
        const n3 = e3.childNodes[t3 - 1], s3 = E(n3);
        s3 && l2.has(s3) || r3.push({ rm: n3 });
      }
    for (const t3 of r3)
      t3.rm && await de(t3.rm), d(t3.add) || fe(e3, t3.add, n2, s2), t3.move && (ue() ? e3.moveBefore(t3.move, t3.target) : e3.insertBefore(t3.move, t3.target)), d(t3.patch) || await ye(t3.target, t3.patch, t3.with, n2, s2);
  }(e2, [n], s, r2), e2);
}
async function ye(e2, t, n, s, r2) {
  if (L.valid(n)) {
    let t2 = e2;
    for (;n.childNodes.length > 0; ) {
      const s2 = n.childNodes.pop();
      e2.parentNode.insertBefore(s2, t2), t2 = s2;
    }
    return q(e2), t2;
  }
  return e2.nodeType === 3 && h(n) ? N(t, n) && (e2.nodeValue = String(n)) : e2 = await be(e2, t, n, s, r2), e2;
}
var me = (e2 = "div", t = null, ...n) => h(t) ? [e2, {}, [t].concat(n).filter((e3) => !d(e3))] : a(t) && !n.length ? [e2, {}, t] : [e2, t || {}, n];

// src/lib/void-tags.js
var VOID_TAGS = new Set((c || []).map((name) => String(name).toLowerCase()));
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
  while (state.i < input.length) {
    const ch = input[state.i];
    if (ch === "<")
      break;
    if (ch === "#" && input[state.i + 1] === "{")
      break;
    state.i++;
  }
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
    if (input[state.i] === "#" && input[state.i + 1] === "{") {
      state.i++;
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
    if (child && typeof child.expr === "string") {
      return child._resolved !== undefined && child._resolved !== null ? escapeText(String(child._resolved)) : `#{${child.expr}}`;
    }
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
  for (let i2 = offset;i2 < args.length; i2++) {
    const child = asChild(args[i2]);
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
    return Array.isArray(result) ? result.map((x2) => {
      if (x2.type === LITERAL && x2.value === "_")
        return LITERAL;
      return Token.get(x2, isWeak);
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
function isLiteral(t, v2) {
  return t && t.type === LITERAL && (v2 ? t.value === v2 : true);
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
  return CONTROL_TYPES.some((k2) => o[k2.substr(1)] && o[k2.substr(1)].isStatement);
}
function hasBreaks(token) {
  if (isString(token) && typeof token.value === "string") {
    return token.value.includes(`
`);
  }
  if (isText(token)) {
    return token.value.buffer.some((x2) => typeof x2 === "string" && x2.includes(`
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
    for (let i2 = 0, c2 = prevValue.length;i2 < c2; i2++) {
      if (hasDiff(prevValue[i2], nextValue[i2], isWeak))
        return true;
    }
    return false;
  }
  if (isPlain2(prevValue)) {
    if (!isPlain2(nextValue))
      return true;
    const a2 = Object.keys(prevValue).sort();
    const b2 = Object.keys(nextValue).sort();
    if (hasDiff(a2, b2, isWeak))
      return true;
    for (let i2 = 0;i2 < a2.length; i2 += 1) {
      if (hasDiff(prevValue[a2[i2]], nextValue[b2[i2]], isWeak))
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
    return nextValue.every((x2) => hasIn(prev, x2));
  }
  if (Array.isArray(prevValue) || typeof prevValue === "string") {
    return prevValue.includes(nextValue);
  }
  if (isObject(prev)) {
    return Array.isArray(nextValue) ? nextValue.every((x2) => (x2 in prevValue)) : (nextValue in prevValue);
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
  return value.replace(/<[^<>]*>/g, (x2) => colorize(STRING, x2));
}
function format(text) {
  const chunks = text.split(/([`*_]{1,2})(.+?)\1/g);
  const buffer = [];
  for (let i2 = 0, c2 = chunks.length;i2 < c2; i2++) {
    if (!chunks[i2].length)
      continue;
    if (chunks[i2].charAt() === "`") {
      buffer.push([CODE, chunks[i2], chunks[++i2]]);
    } else if ("*_".includes(chunks[i2].charAt())) {
      buffer.push([chunks[i2].length > 1 ? BOLD : ITALIC, chunks[i2], chunks[++i2]]);
    } else {
      buffer.push(chunks[i2]);
    }
  }
  return buffer;
}
function pad(nth) {
  return `     ${nth}`.substr(-5);
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
  const e2 = new Err(summary);
  e2.line = tokenInfo ? tokenInfo.line : 0;
  e2.col = tokenInfo ? tokenInfo.col : 0;
  e2.stack = summary;
  throw e2;
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
function debug(err, source, noInfo, callback, colorizeToken = (_2, x2) => x2) {
  err.stack = err.stack || err[err.prevToken ? "summary" : "message"];
  if (typeof source === "undefined") {
    return err.message;
  }
  if (noInfo) {
    return err.stack.replace(/at line \d+:\d+\s+/, "");
  }
  if (err.prevToken) {
    const { line, col } = err.prevToken.tokenInfo;
    if (line !== err.line)
      err.line = line;
    if (col !== err.col)
      err.col = col;
    err.stack += `
  at \`${serialize(err.prevToken, true)}\` at line ${line + 1}:${col + 1}`;
  }
  source = typeof callback === "function" ? callback(source) : source;
  const lines = source.split(`
`).reduce((prev, cur, i2) => {
    prev.push(` ${colorizeToken(err.line !== i2 ? true : null, pad(i2 + 1))} | ${cur}`);
    return prev;
  }, []);
  const padding = Array.from({ length: err.col + 10 }).join("-");
  lines.splice(err.line + 1, 0, `${padding}^`);
  if (err.line) {
    lines.splice(0, err.line - 4);
    lines.length = 10;
  }
  return `${err.stack}

${lines.join(`
`)}
`;
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
function compactText(text, maxLen = 120) {
  const normalized = String(text ?? "").replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
  if (!normalized)
    return "";
  if (normalized.length <= maxLen)
    return normalized;
  return `${normalized.slice(0, Math.max(1, maxLen - 1)).trim()}…`;
}
function compact(token, maxLen = 120, depth = 0) {
  if (typeof token === "undefined")
    return "";
  if (token === null)
    return ":nil";
  if (token === true)
    return ":on";
  if (token === false)
    return ":off";
  if (depth > 4)
    return "…";
  if (typeof token === "number")
    return String(token);
  if (typeof token === "symbol")
    return token.toString().match(/\((.+?)\)/)?.[1] || "symbol";
  if (typeof token === "string")
    return compactText(quote(token), maxLen);
  if (typeof token === "function")
    return `${token.name || "fn"}(…)`;
  if (token instanceof Date)
    return token.toISOString();
  if (token instanceof RegExp)
    return `/${token.source}/${token.flags}`;
  if (Array.isArray(token)) {
    if (token.length === 1)
      return compact(token[0], maxLen, depth + 1);
    if (!token.length)
      return "[ ]";
    const preview = token.slice(0, 3).map((entry) => compact(entry, 24, depth + 1)).join(" ");
    const more = token.length > 3 ? ` … ${token.length} items` : "";
    return compactText(`[ ${preview}${more} ]`, maxLen);
  }
  if (token && typeof token === "object" && token.__tag && Object.prototype.hasOwnProperty.call(token, "value")) {
    return compact(token.value, maxLen, depth + 1);
  }
  if (isUnit(token)) {
    const text = token && token.value && typeof token.value.toString === "function" ? token.value.toString() : String(token);
    return compactText(text, maxLen);
  }
  if (isNumber(token)) {
    const value = typeof token.valueOf === "function" ? token.valueOf() : token.value;
    return String(value);
  }
  if (isSymbol(token))
    return String(token.value ?? token.valueOf?.() ?? "");
  if (isString(token)) {
    if (typeof token.value === "string")
      return compactText(quote(token.value), maxLen);
    const raw = typeof token.valueOf === "function" ? token.valueOf() : token.value;
    return compactText(quote(typeof raw === "string" ? raw : "…"), maxLen);
  }
  if (isLiteral(token)) {
    if (token.isTag) {
      const rendered = renderTag(token.value);
      const match = rendered.match(/^<\s*([^\s/>]+)/);
      return match ? `<${match[1]} …>` : "<…>";
    }
    if (token.isFunction || token.isCallable) {
      const name = token.value?.label || token.value?.name || token.getName?.() || token.name || "fn";
      return `${name}(…)`;
    }
    if (token.isObject) {
      const data = token.valueOf();
      const keys = Object.keys(data || {});
      if (!keys.length)
        return "{ }";
      if (keys.length <= 6)
        return `{ ${keys.join(" ")} }`;
      return `{ ${keys.slice(0, 6).join(" ")} … ${keys.length} keys }`;
    }
  }
  if (isRange(token)) {
    if (Array.isArray(token.value)) {
      if (!token.value.length)
        return "[ ]";
      const preview = token.value.slice(0, 3).map((entry) => compact(entry, 24, depth + 1)).join(" ");
      const more = token.value.length > 3 ? ` … ${token.value.length} items` : "";
      return compactText(`[ ${preview}${more} ]`, maxLen);
    }
    const begin = compact(token.value?.begin, 24, depth + 1);
    const end = compact(token.value?.end, 24, depth + 1);
    return compactText(`${begin}..${end}`, maxLen);
  }
  if (token && typeof token === "object") {
    if (token.isTag && token.value) {
      const rendered = renderTag(token.value);
      const match = rendered.match(/^<\s*([^\s/>]+)/);
      return match ? `<${match[1]} …>` : "<…>";
    }
    if (token.isFunction || token.isCallable) {
      const name = token.value?.label || token.value?.name || token.name || "fn";
      return `${name}(…)`;
    }
    const keys = Object.keys(token);
    if (keys.length) {
      if (keys.length <= 6)
        return `{ ${keys.join(" ")} }`;
      return `{ ${keys.slice(0, 6).join(" ")} … ${keys.length} keys }`;
    }
  }
  return compactText(String(token), maxLen);
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
function isDigit(c2) {
  return c2 >= "0" && c2 <= "9";
}
function isReadable(c2, raw) {
  return c2 === "#" || c2 === "$" || c2 >= "&" && c2 <= "'" || c2 >= "^" && c2 <= "z" || c2 >= "@" && c2 <= "Z" || raw && (c2 === "." || c2 === "-") || c2.charCodeAt() > 127 && c2.charCodeAt() !== 255;
}
function isAlphaNumeric(c2, raw) {
  return isDigit(c2) || isReadable(c2, raw);
}
function getSeparator(_2, o, p2, c2, n, dx) {
  if (isComment(p2) && !isText(c2) || isComment(c2) && !isText(p2)) {
    return (isComment(p2) ? p2 : c2).type === COMMENT_MULTI ? " " : `
`;
  }
  if (dx === "Stmt" && (!o && isBlock(p2) && !isBlock(c2) || isBlock(p2) && isBlock(c2) && !c2.isStatement && c2.isRaw) || isComma(p2) && !isText(c2) || isOperator(p2) && isBlock(c2) || o && isOperator(p2) && (isData(c2) && !isLiteral(c2)) && !(isEOL(o) || isComma(o) || isText(o)) || isData(p2) && isOperator(c2) && isData(n) || isData(o) && isOperator(p2) && isData(c2) || isData(p2) && !isLiteral(p2) && isOperator(c2) || (isBlock(p2) && isOperator(c2) || isBlock(o) && isOperator(p2)) || isLiteral(_2) && isOperator(o) && isOperator(p2) && !isData(n) || isLiteral(p2) && isOperator(c2) && isOperator(n) && c2.value !== n.value || isOperator(o) && isOperator(p2) && o.value !== p2.value && isLiteral(c2))
    return " ";
  if (isBlock(p2) && isBlock(c2) || isBlock(p2) && isData(c2) || isData(p2) && isData(c2) && (!isRange(p2) || !isSymbol(c2)))
    return dx === "Root" || dx !== "Expr" && !isSymbol(p2) ? COMMA : " ";
}
function serialize(token, shorten, colorize = (_2, x2) => typeof x2 === "undefined" ? literal({ type: _2 }) : x2, descriptor = "Root") {
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
    const methods = Object.keys(token).map((k2) => colorize(SYMBOL, `:${k2}`)).join(" ");
    const formatted = (name[3] || name[2] || name[1] || "").trim().replace(/\s+/g, " ");
    return `${colorize(LITERAL, token.name)}${colorize(OPEN, "(")}${formatted.length ? colorize(LITERAL, formatted) : ""}${colorize(CLOSE)}${methods ? `${colorize(BEGIN)}${methods}${colorize(DONE)}` : ""}`;
  }
  if (Array.isArray(token)) {
    if (descriptor === "Object") {
      return `${colorize(BEGIN)}${token.map((x2) => serialize(x2, shorten, colorize, descriptor)).join(`${colorize(COMMA)} `)}${colorize(DONE)}`;
    }
    let prevData = null;
    const hasText = token.some(isText);
    return token.reduce((prev, cur, i2) => {
      const sep = getSeparator(prevData, token[i2 - 2], token[i2 - 1], cur, token[i2 + 1], descriptor);
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
        for (let i2 = 0, c2 = subTree.length;i2 < c2; i2++) {
          const cur = subTree[i2];
          const next = subTree[i2 + 1];
          const prev = subTree[i2 - 1];
          if ((!prev || prev.type === PLUS) && cur.type === OPEN && cur.value === "#{") {
            buffer.pop();
            buffer.push(colorize(null, "#{"));
            continue;
          }
          if ((!next || next.type === PLUS) && cur.type === CLOSE && cur.value === "}") {
            buffer.push(colorize(null, "}"));
            i2++;
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
              i2++;
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
    return Object.keys(token).map((k2) => colorize(SYMBOL, `${prefix2}${k2}`)).join(separator);
  }
  const prefix = hasStatements(token) ? "@" : ":";
  const block = Object.keys(token).map((k2) => `${colorize(SYMBOL, `${prefix}${k2}`)} ${serialize(token[k2], shorten, colorize, descriptor)}`);
  return descriptor === "Object" ? `${colorize(OPEN)}${block.join(separator)}${colorize(CLOSE)}` : block.join(separator);
}
function SYMBOL_NAME(sym) {
  if (!sym || typeof sym !== "symbol")
    return "";
  return sym.toString().match(/Symbol\((.+)\)/)?.[1] ?? "";
}
function unitKindFromToken(token) {
  const kind = token?.value?.value?.kind ?? token?.value?.kind;
  if (typeof kind === "string" && kind.trim())
    return kind.trim();
  const asText = String(token?.value?.toString?.() ?? "");
  const match = asText.match(/[A-Za-z]{1,10}$/);
  return match?.[0] || "";
}
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
  if (token.isNumber) {
    const unitKind = unitKindFromToken(token);
    if (unitKind)
      return `unit<${unitKind}>`;
    return "number";
  }
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
function canonicalTypeName(typeName) {
  const text = String(typeName || "").trim().toLowerCase();
  if (!text)
    return "";
  if (text === "num" || text === "number")
    return "number";
  if (text === "str" || text === "string")
    return "string";
  if (text === "bool" || text === "boolean")
    return "boolean";
  if (text.startsWith("unit<") && text.endsWith(">"))
    return "number";
  if (text === "list" || text.startsWith("list<"))
    return "list";
  return text;
}
function matchesType(value, typeStr, env) {
  const declared = canonicalTypeName(typeStr);
  if (!declared || declared === "any" || declared === "unknown")
    return true;
  if (env && typeof env.getAnnotation === "function") {
    const name = value?.name ?? "";
    if (name) {
      const ann = env.getAnnotation(name);
      if (ann)
        return canonicalTypeName(String(ann)) === declared;
    }
  }
  const actual = canonicalTypeName(inferRuntimeType(value));
  if (!actual || actual === "unknown")
    return true;
  return actual === declared;
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
    return this.tokenInfo?.kind === "raw";
  }
  get isMulti() {
    return this.tokenInfo?.kind === "multi";
  }
  get isMarkup() {
    return this.tokenInfo?.kind === "markup";
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
  push(...v2) {
    return this.value.body.push(...v2);
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
      const self = body.slice();
      for (let i2 = 0, c2 = self.length;i2 < c2; i2++) {
        if (self[i2].isCallable && params[self[i2].value.name]) {
          const fixedBody = params[self[i2].value.name].slice();
          const fixedName = fixedBody.pop();
          self[i2].value.name = fixedName.value;
          self[i2].value.body = Expr.sub(self[i2].value.body, params);
          self.splice(i2 - 1, 0, ...fixedBody);
        } else if (isLiteral(self[i2]) && typeof self[i2].value === "string") {
          if (!params[self[i2].value])
            continue;
          c2 += params[self[i2].value].length - 1;
          self.splice(i2, 1, ...params[self[i2].value]);
        } else {
          self[i2] = Expr.sub(self[i2], params);
        }
      }
      return self;
    }
    if (Array.isArray(body.value)) {
      body.value = Expr.sub(body.value, params);
    } else if (body.isObject) {
      Object.keys(body.value).forEach((k2) => {
        body.value[k2].value.body = Expr.sub(body.value[k2].value.body, params);
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
    return Expr.sub(copy(tpl.body), tpl.args.reduce((prev, cur, i2) => {
      prev[cur.value] = others[i2];
      return prev;
    }, {}));
  }
  static cut(ast) {
    const count = ast.length;
    const left = [];
    let i2 = 0;
    for (;i2 < count; i2++) {
      if (isResult(ast[i2]) && isResult(left[left.length - 1]))
        break;
      left.push(ast[i2]);
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
      return type.map((x2) => Expr.from(x2));
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
    for (let i2 = 0, c2 = values.length;i2 < c2; i2++) {
      if (isComma(values[i2])) {
        list[list.length - 1] = stack[0];
        stack = list[++key] = [];
      } else {
        stack.push(values[i2]);
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
        let i2 = 0;
        for (;i2 < 5; i2++) {
          if (buffer.charAt(i2) === "#")
            level++;
          else
            break;
        }
        buffer = buffer.substr(i2);
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
    for (let c2 = values.length;inc < c2; inc++) {
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
        prev.push(...cur.getBody().reduce((p2, c2) => {
          if (!isComma(c2)) {
            if (c2.isObject) {
              p2.push(...Expr.cast([c2], types));
            } else {
              if (!types.includes(c2.type))
                assert(c2, true, ...types);
              p2.push(c2);
            }
          }
          return p2;
        }, []));
      } else if (cur.isObject) {
        const map = cur.valueOf();
        Object.keys(map).forEach((prop) => {
          map[prop].getBody().forEach((c2) => {
            if (!types.includes(c2.type))
              assert(c2, true, ...types);
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
      return Expr.array(mixed.map((x2) => Expr.value(x2)), tokenInfo);
    }
    return Expr.from(LITERAL, mixed, tokenInfo);
  }
  static plain(mixed, callback, descriptor) {
    if (Array.isArray(mixed)) {
      return mixed.map((x2) => Expr.plain(x2, callback, descriptor));
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
  static frac(a2, b2, tokenInfo) {
    return Expr.from(NUMBER, new Expr.Frac(a2, b2), tokenInfo);
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
      const b2 = CURRENCY_EXCHANGES[newKind];
      if (!a2)
        throw new Error(`Unsupported ${this.kind} currency`);
      if (!b2)
        throw new Error(`Unsupported ${newKind} currency`);
      value = this.num * b2 / a2;
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
    const b2 = 10 ** right.length;
    const factor = Frac.gcd(a2, b2);
    if (left < 1) {
      return new Frac(a2 / factor, b2 / factor);
    }
    return new Frac(b2 / factor, a2 / factor);
  }
  static gcd(a2, b2) {
    if (!b2)
      return a2;
    return Frac.gcd(b2, a2 % b2);
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
    return invoke ? Range.run(this, callback || ((x2) => x2)) : this;
  }
  static async run(gen, callback) {
    const it = gen.getIterator();
    const seq = [];
    const max = gen.infinite ? Infinity : gen.end > gen.begin ? gen.end - gen.begin : gen.begin - gen.end;
    for (let i2 = 0, nextValue = it.next();nextValue.done !== true; nextValue = it.next(), i2++) {
      let keep = true;
      if (gen.offset !== null) {
        if (gen.offset >= 0) {
          keep = i2 >= gen.offset;
        } else if (gen.infinite) {
          throw new Error("Negative offsets are not supported for infinite ranges");
        } else if (gen.begin < 0) {
          keep = max - i2 + gen.offset < 0;
        } else {
          keep = i2 >= gen.offset + gen.end;
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
  static *build(begin, end, i2) {
    const infinite = end === Infinity || end === -Infinity;
    let current2 = begin;
    while (true) {
      yield current2;
      if (!infinite && current2 === end)
        return;
      current2 += i2;
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
    for (let j = 0, k2 = result.length;j < k2; j++) {
      const values = await Range.unwrap(result[j], callback, nextToken);
      for (let i2 = 0, c2 = values.length;i2 < c2; i2++) {
        let data;
        if (values[i2] instanceof Range || isRange(values[i2])) {
          data = await Range.run(values[i2].value || values[i2], callback);
        } else {
          data = await callback(values[i2]);
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
    for (let i2 = 0, c2 = lazy.ops.length;i2 < c2; i2++) {
      const op = lazy.ops[i2];
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
function equals(a2, b2, weak) {
  if (typeof a2 === "undefined")
    raise("Missing left value");
  if (typeof b2 === "undefined")
    raise("Missing right value");
  return !hasDiff(a2, b2, weak);
}
function items(...args) {
  return args.reduce((p2, c2) => p2.concat(c2), []);
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
    const b3 = length ? length.valueOf() : 1;
    const a3 = offset ? offset.valueOf() : arr2.length - b3;
    arr2.splice(a3, b3);
    return arr2;
  }
  const arr = list(input);
  const b2 = length ? length.valueOf() : 1;
  const a2 = offset ? offset.valueOf() : arr.length - b2;
  arr.splice(a2, b2);
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
  for (let i2 = 0, c2 = arr.length;i2 < c2; i2++) {
    out.push(fromToken(await callback(toToken(arr[i2]))));
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
  for (let i2 = 0, c2 = arr.length;i2 < c2; i2++) {
    if (await callback(toToken(arr[i2]))) {
      out.push(arr[i2]);
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
  return pairs(input).map(([k2]) => k2);
}
function vals(input) {
  return pairs(input).map((x2) => x2[1]);
}
async function check2(input, run) {
  if (!input || !input.length)
    raise("Missing expression to check");
  const offset = input.findIndex((x2) => isSome(x2) || isOR(x2));
  const expr = offset > 0 ? input.slice(0, offset) : input;
  const msg = offset > 0 ? input.slice(offset + 1) : [];
  const [result] = await run(...expr);
  const passed = result && result.get() === true;
  if (!isSome(input[offset]) ? !passed : passed) {
    let debug2;
    if (msg.length > 0) {
      [debug2] = await run(...msg);
      debug2 = debug2 && debug2.valueOf();
    }
    return `\`${serialize(expr)}\` ${debug2 || "did not passed"}`;
  }
}
function format2(str, ...args) {
  if (!str)
    raise("No format string given");
  if (!str.isString)
    raise("Invalid format string");
  if (!args.length)
    raise("Missing value to format");
  const data = args.reduce((p2, c2) => {
    if (p2[p2.length - 1] && (p2[p2.length - 1].isRange && c2.isRange || p2[p2.length - 1].isObject && c2.isObject)) {
      push(p2[p2.length - 1], c2);
    } else
      p2.push(c2);
    return p2;
  }, []);
  let offset = 0;
  return str.value.replace(RE_PLACEHOLDER, (_2, key) => {
    if (!RE_FORMATTING.test(key))
      raise(`Invalid format \`${_2}\``);
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
      return _2;
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
    this.annotations = {};
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
  annotate(name, typeText) {
    this.annotations[name] = String(typeText || "").trim();
  }
  getAnnotation(name, recursive = true) {
    if (this.annotations[name])
      return this.annotations[name];
    if (recursive && this.parent)
      return this.parent.getAnnotation(name, recursive);
    return null;
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
    } catch (e2) {
      raise(`${e2.message} (${label})`, ctx.tokenInfo);
    }
  }
  static merge(list2, values, hygiene, environment) {
    const args = Expr.args(values, true);
    for (let i2 = 0, c2 = args.length;i2 < c2; i2++) {
      if (list2.length) {
        const key = args[i2].value;
        const value = key === ".." ? list2.splice(0, list2.length) : list2.shift();
        if (!hygiene || !(environment.parent && environment.parent.has(key, true))) {
          environment.def(key, Array.isArray(value) ? Expr.body(value, args[i2].tokenInfo) : value);
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
          let i2 = 0;
          level++;
          for (;i2 < 4; i2++) {
            if (this.blank.charAt(i2) === "#")
              level++;
            else
              break;
          }
          if (this.blank.charAt(i2) !== " ") {
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
        } else {
          let next = this.peek();
          if (next === " " || next === "\t" || next === "\r") {
            let i2 = 0;
            while (this.peekToken(i2) === " " || this.peekToken(i2) === "\t" || this.peekToken(i2) === "\r")
              i2++;
            next = this.peekToken(i2);
          }
          if (next === `
` || this.isDone() || next === "" || typeof next === "undefined") {
            this.addToken(EOL);
          } else {
            this.addToken(DOT);
          }
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
      let i2 = this.offset + 1;
      while (i2 < this.chars.length && isDigit(this.chars[i2]))
        i2++;
      if (i2 < this.chars.length && this.chars[i2] === ".") {} else {
        this.nextToken();
        while (isDigit(this.peek()))
          this.nextToken();
        const [left, right] = this.getCurrent().split("/");
        value = new Expr.Frac(parseFloat(left), parseFloat(right));
      }
    }
    if (this.peek() === " " || isReadable(this.peek())) {
      const num = value ? value.valueOf() : this.getCurrent();
      let i2 = this.offset + (this.peek() === " " ? 1 : 0);
      let kind = "";
      for (let c2 = this.chars.length;i2 < c2; i2++) {
        if (!isReadable(this.chars[i2]))
          break;
        kind += this.chars[i2];
      }
      const retval = kind && Env.register(parseFloat(num), kind);
      if (isPlain2(retval)) {
        this.offset = this.start = i2;
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
    let i2 = this.offset;
    if ("*_".includes(char)) {
      if (this.peek() === char) {
        char += this.getToken(++i2);
      } else if (!isAlphaNumeric(this.peek()))
        return;
    } else {
      this.pushToken(char);
    }
    for (let c2 = this.chars.length;i2 < c2; i2++) {
      if ("*_".includes(char)) {
        if (this.chars[i2] === char)
          break;
      } else if (char.length === 2) {
        if (char === this.chars[i2] + this.chars[i2 + 1])
          break;
      } else if (!isAlphaNumeric(this.chars[i2], true))
        break;
      if (this.chars[i2] === "." && /^\d+$/.test(this.blank))
        break;
      this.pushToken(this.chars[i2]);
    }
    const token = this.chars[i2];
    const nextToken = this.chars[i2 + 1];
    if (/^\d+$/.test(this.blank) && token === " " && isAlphaNumeric(nextToken)) {
      this.blank = "";
      return;
    }
    if (/^\d+$/.test(this.blank) && token === "." && nextToken === " ") {
      this.parseItem(this.blank);
      return true;
    }
    if (char.length === 1 && char === token || char.length === 2 && char === token + nextToken) {
      this.offset = this.start = i2 + char.length;
      this.blank = char + this.blank + char;
      this.appendText();
      this.parseLine();
      this.appendText();
      return true;
    }
    const looksLikeUnitLiteral = /^\d+[A-Za-z_][A-Za-z0-9_]*$/.test(this.blank);
    if (isReadable(this.blank) && token === "*" || nextToken === " " && ");:.,".includes(token) && !(token === "." && looksLikeUnitLiteral) || token === " " && (nextToken === "*" || nextToken && isAlphaNumeric(nextToken))) {
      this.pushToken(token, nextToken);
      this.offset = this.start = i2 + 2;
      this.parseLine();
      this.appendText();
      return true;
    }
    if (token === " " && nextToken === "(" && /^[A-Z]/.test(this.blank)) {
      this.pushToken(token);
      this.offset = this.start = i2 + 1;
      this.parseLine();
      this.appendText();
      return true;
    }
    this.blank = "";
  }
  subString(chunk, isMarkup, tokenInfo) {
    if (chunk.indexOf("#{") === -1 || isMarkup) {
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
    let hadInterpolation = false;
    while (!this.isDone()) {
      if (this.peek() === `
`) {
        if (!stack.length && !hadInterpolation)
          raise("Unterminated string", this);
        this.col = -1;
        this.line++;
      }
      if (this.peek() === "#" && this.peekNext() === "{") {
        stack.push(OPEN);
        hadInterpolation = true;
      }
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
    let i2 = this.offset;
    for (let c2 = this.chars.length;i2 < c2; i2++) {
      const last = this.chars[i2 - 1];
      const cur = this.chars[i2];
      if (flags) {
        if ("igmu".includes(cur)) {
          flags += cur;
          continue;
        }
        if (isAlphaNumeric(cur)) {
          this.col = i2;
          raise(`Unknown modifier \`${cur}\``, this);
        }
        --i2;
        break;
      }
      if (cur === "/" && last !== "\\") {
        const next = this.chars[i2 + 1];
        if (next && isAlphaNumeric(next)) {
          if ("igmu".includes(next)) {
            flags += this.chars[++i2];
            continue;
          }
          this.col = ++i2;
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
    this.offset = this.start = ++i2;
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
      if (args.some((x2) => isLiteral(x2, ".."))) {
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
    for (let i2 = this.offset, c2 = this.tokens.length;i2 < c2; i2++) {
      if (this.tokens[i2].type === token)
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
  nextSignificantIndex(offset = this.offset) {
    let idx = offset;
    while (idx < this.tokens.length && isText(this.tokens[idx]))
      idx++;
    return idx;
  }
  tokenSourceText(token) {
    if (!token)
      return "";
    if (isText(token) && token.value && Array.isArray(token.value.buffer)) {
      return token.value.buffer.map((part) => typeof part === "string" ? part : "").join("");
    }
    if (token.type === STRING) {
      return `"${String(token.value || "")}"`;
    }
    return literal(token);
  }
  parseAnnotation(token, tokenInfo) {
    const colon1 = this.nextSignificantIndex(this.offset);
    const first = this.tokens[colon1];
    if (!isSymbol(first) || first.value !== ":")
      return null;
    const colon2 = this.nextSignificantIndex(colon1 + 1);
    const second = this.tokens[colon2];
    if (!isSymbol(second) || second.value !== ":")
      return null;
    let i2 = colon2 + 1;
    const parts = [];
    while (i2 < this.tokens.length && !isEOL(this.tokens[i2]) && !isEOF(this.tokens[i2])) {
      parts.push(this.tokenSourceText(this.tokens[i2]));
      i2++;
    }
    const typeText = parts.join("").trim();
    if (!typeText)
      return null;
    this.offset = i2;
    this.current = this.tokens[Math.min(i2, this.tokens.length - 1)];
    return Expr.map({
      annot: Expr.stmt("@annot", [
        Expr.local(token.value, tokenInfo),
        Expr.value(typeText, tokenInfo)
      ], tokenInfo)
    }, tokenInfo);
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
        this.partial.forEach((x2) => push2(Expr.from(x2)));
        this.template = null;
      }
      if (isLiteral(token)) {
        const annotation = this.parseAnnotation(token, tokenInfo);
        if (annotation) {
          push2(annotation);
          continue;
        }
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
          args.forEach((x2) => {
            if (isRange(x2))
              x2.type = LITERAL;
            assert(Array.isArray(x2) ? x2[0] : x2, true, LITERAL);
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
          } catch (_2) {
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
      for (let i2 = 0, c2 = body.length;i2 < c2; i2++) {
        if (hasBreaks(body[i2])) {
          let count = 0;
          if (isText(body[i2])) {
            body[i2].value.buffer.forEach((x2) => {
              count += x2.split(`
`).length - 1;
            });
          } else {
            count = body[i2].value.split(`
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
function parseAnnotation(annStr) {
  if (!annStr || typeof annStr !== "string")
    return null;
  const trimmed = annStr.trim();
  if (!trimmed)
    return null;
  const arrowIndex = trimmed.indexOf("->");
  if (arrowIndex === -1) {
    return { params: trimmed.split(",").map((s) => s.trim()).filter(Boolean) };
  }
  const paramsStr = trimmed.slice(0, arrowIndex).trim();
  const returnsStr = trimmed.slice(arrowIndex + 2).trim();
  return {
    params: paramsStr ? paramsStr.split(",").map((s) => s.trim()).filter(Boolean) : [],
    returns: returnsStr || null
  };
}
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
    for (let i2 = 0, c2 = args.length;i2 < c2; i2++) {
      const cur = args[i2];
      const next = args[i2 + 1];
      if (isString(cur) && isSymbol(next) && next.value === ":") {
        normalized.push(Expr.symbol(`:${cur.value}`, false, cur.tokenInfo || cur));
        changed = true;
        i2++;
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
    for (let i2 = 0, c2 = tokens.length;i2 < c2; i2++) {
      const token = tokens[i2];
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
    for (let i2 = 0, c2 = name.length;i2 < c2; i2++) {
      node = node[name[i2]];
      if (!node)
        return null;
    }
    return node && node.args ? node : null;
  }
  static registerTemplateByName(templates, name, definition) {
    if (!templates || !name || !definition)
      return;
    let root = templates;
    for (let i2 = 0, c2 = name.length - 1;i2 < c2; i2++) {
      const key = name[i2];
      if (!root[key])
        root[key] = {};
      root = root[key];
    }
    root[name[name.length - 1]] = definition;
  }
  static async resolveMatchBody(input, cases, environment, parentTokenInfo) {
    const target = Eval.getResultTagToken(input) || input;
    for (let i2 = 0, c2 = cases.length;i2 < c2; i2++) {
      const [head2, ...body] = cases[i2];
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
        for (let j = 0, k2 = result.length;j < k2; j++) {
          let subBody = result[j];
          if (isArray(subBody)) {
            if (isRange(subBody.value[0])) {
              subBody = await subBody.value[0].value.run(true);
            }
            if (subBody.valueOf().some((x2) => !hasDiff(x2, target))) {
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
  replace(v2, ctx) {
    if (!ctx) {
      this.result[Math.max(0, this.result.length - 1)] = v2;
    } else {
      this.ctx = v2;
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
      } catch (e2) {
        if (e2 instanceof TypeError) {
          raise(e2.message, this.ctx.tokenInfo, label);
        }
        e2.prevToken = this.oldToken() || this.olderToken();
        e2.stack = e2.message;
        throw e2;
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
          info = `(${Object.keys(map2).map((k2) => `:${k2}`).join(" ")})`;
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
        this.append(Expr.array(options.reduce((p2, c2) => {
          if (c2.isStatement)
            p2.push(...c2.getBody());
          else
            p2.push(c2);
          return p2;
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
    if (isBlock(next) && target.args && target.args.some((x2) => isLiteral(x2, ".."))) {
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
          const rawTextContainer = /^(style|script)$/i.test(String(node.name || ""));
          if (rawTextContainer) {
            children.push(`{${child.expr}}`);
            continue;
          }
          const parts = await this.evalTagExpr(child.expr);
          if (parts.length === 1) {
            const fixed2 = normalizeChild(parts[0]);
            if (fixed2 !== null && typeof fixed2 !== "undefined") {
              const isTagNode = fixed2 && typeof fixed2 === "object" && typeof fixed2.name === "string";
              children.push(isTagNode ? fixed2 : { expr: child.expr, _resolved: fixed2 });
            }
          } else {
            parts.forEach((part) => {
              const fixed2 = normalizeChild(part);
              if (fixed2 !== null && typeof fixed2 !== "undefined")
                children.push(fixed2);
            });
          }
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
      this.append(Expr.value(values[isSome(this.ctx) ? "some" : "every"]((x2) => x2[0].valueOf())));
      return true;
    }
    if (result.length > 2) {
      for (let i2 = 1, c2 = value.length;i2 < c2; i2++) {
        let left;
        let right;
        try {
          left = await Eval.do(value.slice(0, i2), this.env, "LogicArg", true, this.ctx.tokenInfo);
          right = await Eval.do(value.slice(i2), this.env, "LogicArg", true, this.ctx.tokenInfo);
        } catch (_2) {
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
      const fixedArgs = args2.filter((x2) => !isLiteral(x2, "_"));
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
      if (fixedArgs.length > prev.length && !prev.getArgs().some((x2) => isLiteral(x2, ".."))) {
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
        if (target.body.some((x2) => isBlock(x2) && x2.isRaw)) {
          if (this.descriptor === "Eval" || this.descriptor === "Fn") {
            this.env = new Env(this.env);
          }
          ctx = this.env;
          clean = target.body.length === 1 && isBlock(target.body[0]);
        }
        if (target.args && target.args.length === fixedArgs.length) {
          Env.merge(fixedArgs, target.args, clean, ctx);
        }
        const fnName = prev.getName();
        if (fnName) {
          const ann = this.env.getAnnotation(fnName);
          if (ann && typeof ann === "string") {
            const annotation = parseAnnotation(ann);
            if (annotation?.params?.length) {
              for (let i2 = 0;i2 < annotation.params.length && i2 < fixedArgs.length; i2++) {
                const expected = annotation.params[i2];
                const actual = fixedArgs[i2];
                if (!matchesType(actual, expected, this.env)) {
                  const got = inferRuntimeType(actual);
                  raise(`\`${fnName}\`: expected ${expected}, got ${got} (arg ${i2 + 1})`, this.ctx.tokenInfo);
                }
              }
            }
          }
        }
        const result = await Eval.do(target.body, ctx, `:${fnName || ""}`, true, this.ctx.tokenInfo);
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
        if (call[0] && call[0].isObject && call[0].value) {
          if (call[0].value.signal || call[0].value.computed) {
            call[0]._assignName = name;
          }
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
        const newValue = prev.value.replace(/{(\d+)?}/g, (_2, idx) => {
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
    return tokens.filter((x2) => ![EOL, COMMA].includes(x2.type));
  }
  static info(defaults) {
    Eval.detail = defaults;
    return defaults;
  }
  static wrap(self) {
    return async (fn, args, label) => {
      const safeArgs = Array.isArray(args) ? args : [];
      const fnArgs = typeof fn?.getArgs === "function" && Array.isArray(fn.getArgs()) ? fn.getArgs() : [];
      if (typeof fn.length === "number" && fn.length > safeArgs.length) {
        raise(`Missing arguments to call \`${fn.getName()}\``, self.ctx.tokenInfo);
      }
      try {
        const scope = new Env(self.env);
        Env.merge(safeArgs, fnArgs, false, scope);
        const [value] = await Eval.do(fn.getBody(), scope, label, false, self.ctx.tokenInfo);
        return value ? Expr.plain(value, self.convert, `<${fn.name || "Function"}>`) : undefined;
      } catch (e2) {
        raise(e2.message.replace(/\sat line.*$/, ""), self.ctx.tokenInfo);
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
          } catch (e2) {
            raise(`Failed to call \`${method}\` (${e2.message})`);
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
    for (let i2 = 1, c2 = expr.length;i2 < c2; i2++) {
      const op = expr[i2];
      if (op && ops.has(op.type) && i2 + 1 < c2) {
        const left = output.pop();
        const right = expr[++i2];
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
    const convert2 = state && typeof state.convert === "function" ? state.convert : null;
    const isDirectiveStmt = (stmt) => !!(stmt && typeof stmt.getBody === "function");
    const normalizeDirectiveArgs = (stmt) => {
      if (!isDirectiveStmt(stmt))
        return [];
      const body = stmt.getBody();
      const flat = body.length === 1 && body[0] && body[0].type === BLOCK && body[0].hasBody ? body[0].getBody() : body;
      return flat.filter((part) => part && part.type !== COMMA);
    };
    const toPlain = (valueToken) => Expr.plain(valueToken, convert2, "<Directive>");
    const resolveRuntimeFn = (name) => {
      if (!environment.has(name, true)) {
        raise(`Undeclared local \`${name}\``, parentTokenInfo);
      }
      const entry = environment.get(name);
      const [head2] = entry && entry.body || [];
      const fn = head2 ? toPlain(head2) : null;
      if (typeof fn !== "function") {
        raise(`\`${name}\` is not callable`, parentTokenInfo);
      }
      return fn;
    };
    const isSignalValue = (candidate) => candidate && typeof candidate.get === "function" && typeof candidate.set === "function";
    const hasShadow = isDirectiveStmt(value.shadow);
    const htmlTextFromValue = (entry) => {
      if (entry === null || typeof entry === "undefined")
        return "";
      if (Array.isArray(entry)) {
        return entry.map(htmlTextFromValue).join("");
      }
      if (entry instanceof Expr) {
        if (entry.isTag)
          return renderTag(entry.valueOf());
        return htmlTextFromValue(Expr.plain(entry, convert2, "<HTML>"));
      }
      if (typeof entry === "object" && typeof entry.name === "string" && Array.isArray(entry.children)) {
        return renderTag(entry);
      }
      return String(entry);
    };
    let signalMap = new Map;
    const tagToVdom = (node) => {
      const attrs = {};
      for (const [key, val] of Object.entries(node.attrs || {})) {
        attrs[key] = val && typeof val.expr === "string" ? String(val.expr) : val;
      }
      const children = (node.children || []).map((child) => {
        if (typeof child === "string")
          return child;
        if (child && typeof child.expr === "string") {
          return signalMap.get(child.expr) ?? child._signal ?? child._resolved ?? "";
        }
        if (typeof child === "object" && typeof child.name === "string")
          return tagToVdom(child);
        return String(child);
      });
      return [node.name, attrs, children];
    };
    const htmlVdomFromValue = (entry) => {
      if (entry === null || typeof entry === "undefined")
        return "";
      if (Array.isArray(entry)) {
        return entry.map(htmlVdomFromValue);
      }
      if (entry instanceof Expr) {
        if (entry.isTag)
          return tagToVdom(entry.valueOf());
        return htmlVdomFromValue(Expr.plain(entry, convert2, "<HTML>"));
      }
      if (isSignalValue(entry))
        return entry;
      if (typeof entry === "object" && typeof entry.name === "string" && Array.isArray(entry.children)) {
        return tagToVdom(entry);
      }
      return String(entry);
    };
    const renderDisposers = environment.__xRenderDisposers instanceof Map ? environment.__xRenderDisposers : environment.__xRenderDisposers = new Map;
    const onDisposers = environment.__xOnDisposers instanceof Map ? environment.__xOnDisposers : environment.__xOnDisposers = new Map;
    const resolveShadowHost = (candidate) => {
      let host = candidate;
      if (typeof host === "string") {
        if (typeof document === "undefined" || !document.querySelector) {
          raise(`Shadow host not found: ${host}`, parentTokenInfo);
        }
        host = document.querySelector(host);
      }
      if (!host) {
        host = environment.__xLastShadowHost || null;
      }
      if (!host || typeof host !== "object") {
        raise("Shadow host not found", parentTokenInfo);
      }
      if (!host.shadowRoot) {
        if (typeof host.attachShadow !== "function") {
          raise("Shadow host does not support attachShadow", parentTokenInfo);
        }
        host.attachShadow({ mode: "open" });
      }
      return host;
    };
    let isDone2;
    if (value.annot instanceof Expr.Statement) {
      const [nameToken, typeToken] = value.annot.getBody();
      const name = nameToken && nameToken.valueOf ? String(nameToken.valueOf()) : "";
      const typeText = typeToken && typeToken.valueOf ? String(typeToken.valueOf()) : "";
      if (name) {
        environment.annotate(name, typeText);
      }
      isDone2 = true;
    }
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
      for (let i2 = 0, c2 = body.length;i2 < c2; i2++) {
        const [head2, ...tail2] = body[i2].getBody();
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
        headers.forEach((header, i2) => {
          entry[header] = Expr.body([Eval.tableCellToken(row[i2], parentTokenInfo)], parentTokenInfo);
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
    if (isDirectiveStmt(value.signal)) {
      if (token.__signalCached) {
        subTree.push(token.__signalCached);
        isDone2 = true;
      }
      if (isDone2) {} else {
        const signal = resolveRuntimeFn("signal");
        const args = normalizeDirectiveArgs(value.signal);
        const runtimeArgs = [];
        for (let i2 = 0;i2 < args.length; i2++) {
          const evaluated = await Eval.do([args[i2]], environment, "Expr", true, parentTokenInfo);
          if (!evaluated.length)
            continue;
          runtimeArgs.push(toPlain(evaluated.length === 1 ? evaluated[0] : evaluated));
        }
        const signalName = token._assignName || (token && typeof token.getName === "function" ? token.getName() : null);
        if (signalName && runtimeArgs.length < 2) {
          runtimeArgs.push(signalName);
        }
        token.__signalCached = Expr.value(signal(...runtimeArgs), parentTokenInfo);
        subTree.push(token.__signalCached);
        isDone2 = true;
      }
    }
    if (isDirectiveStmt(value.render)) {
      const renderArgs = normalizeDirectiveArgs(value.render);
      const selectorTokens = renderArgs.length ? await Eval.do(renderArgs, environment, "Expr", true, parentTokenInfo) : [];
      const selector = selectorTokens.length ? toPlain(selectorTokens.length === 1 ? selectorTokens[0] : selectorTokens) : undefined;
      const shadowArgs = hasShadow ? normalizeDirectiveArgs(value.shadow) : [];
      let shadowSelector;
      if (shadowArgs.length) {
        const shadowTokens = await Eval.do(shadowArgs, environment, "Expr", true, parentTokenInfo);
        if (shadowTokens.length) {
          shadowSelector = toPlain(shadowTokens.length === 1 ? shadowTokens[0] : shadowTokens);
        }
      }
      if (isDirectiveStmt(value.html)) {
        const html = resolveRuntimeFn("html");
        const render2 = hasShadow ? resolveRuntimeFn("renderShadow") : resolveRuntimeFn("render");
        const htmlBody = normalizeDirectiveArgs(value.html);
        const renderKey = selector != null ? String(selector) : hasShadow ? typeof shadowSelector !== "undefined" ? String(shadowSelector) : "__last_shadow__" : "__default__";
        for (const [key, prev] of renderDisposers) {
          if (key === renderKey || key === `shadow:${renderKey}` || key === `dom:${renderKey}`) {
            if (typeof prev.stop === "function")
              prev.stop();
            renderDisposers.delete(key);
          }
        }
        const view = html(async () => {
          const scope = new Env(environment);
          signalMap = new Map;
          const localNames = Object.keys(environment.locals || {});
          for (let i2 = 0;i2 < localNames.length; i2++) {
            const name = localNames[i2];
            const local = environment.locals[name];
            const [head2] = local && local.body || [];
            if (!(head2 && head2.isObject && head2.value && head2.value.signal))
              continue;
            const signalEntry = environment.get(name);
            const resolvedBody = signalEntry && signalEntry.body ? signalEntry.body : [];
            if (!resolvedBody.length)
              continue;
            const resolved = await Eval.do(resolvedBody, environment, "Lit", false, parentTokenInfo);
            if (!resolved || !resolved.length)
              continue;
            const plain = toPlain(resolved.length === 1 ? resolved[0] : resolved);
            if (!isSignalValue(plain))
              continue;
            signalMap.set(name, plain);
            scope.def(name, Expr.value(plain.peek(), parentTokenInfo));
          }
          const rendered = await Eval.do(htmlBody, scope, "Render", true, parentTokenInfo);
          if (!rendered.length)
            return "";
          const result = htmlVdomFromValue(rendered.length === 1 ? rendered[0] : rendered);
          if (typeof result === "string" && signalMap.size > 0) {
            signalMap.forEach((sig) => sig.get());
          }
          return result;
        });
        if (hasShadow) {
          const host = resolveShadowHost(typeof shadowSelector !== "undefined" ? shadowSelector : selector);
          environment.__xLastShadowHost = host;
          if (host.shadowRoot)
            host.shadowRoot.innerHTML = "";
          renderDisposers.set(renderKey, render2(host, view));
        } else {
          if (typeof document !== "undefined") {
            const target = typeof selector === "string" ? document.querySelector(selector) : selector;
            if (target)
              target.innerHTML = "";
          }
          renderDisposers.set(renderKey, render2(selector, view));
        }
      }
      isDone2 = true;
    }
    if (isDirectiveStmt(value.on)) {
      const on = resolveRuntimeFn("on");
      const args = normalizeDirectiveArgs(value.on);
      const shadowParts = hasShadow ? normalizeDirectiveArgs(value.shadow) : [];
      const unwrapHandlerToken = (candidate) => {
        if (!candidate)
          return null;
        if (candidate.isCallable)
          return candidate;
        if (candidate.isBlock && candidate.hasBody) {
          const body = candidate.getBody();
          if (body.length === 1 && body[0] && body[0].isCallable)
            return body[0];
        }
        return null;
      };
      let eventToken = args[0];
      let selectorToken = args[1];
      let handlerToken = args[2];
      if (!handlerToken && shadowParts.length) {
        const maybeHandler = unwrapHandlerToken(shadowParts[0]);
        if (maybeHandler) {
          handlerToken = maybeHandler;
          shadowParts.shift();
        }
      }
      if (!eventToken || !selectorToken || !handlerToken) {
        raise("`@on` expects event, selector and handler", parentTokenInfo);
      }
      const [eventValue] = await Eval.do([eventToken], environment, "Expr", true, parentTokenInfo);
      const [selectorValue] = await Eval.do([selectorToken], environment, "Expr", true, parentTokenInfo);
      const eventName = toPlain(eventValue);
      const selector = toPlain(selectorValue);
      let shadowSelector;
      if (shadowParts.length) {
        const shadowTokens = await Eval.do(shadowParts, environment, "Expr", true, parentTokenInfo);
        if (shadowTokens.length) {
          shadowSelector = toPlain(shadowTokens.length === 1 ? shadowTokens[0] : shadowTokens);
        }
      }
      let handler;
      if (handlerToken && handlerToken.isCallable && handlerToken.hasBody && handlerToken.getName) {
        const targetName = handlerToken.getName();
        if (environment.has(targetName, true)) {
          const targetEntry = environment.get(targetName);
          const resolvedTarget = targetEntry && targetEntry.body ? await Eval.do(targetEntry.body, environment, "Lit", false, parentTokenInfo) : [];
          const target = resolvedTarget.length ? toPlain(resolvedTarget.length === 1 ? resolvedTarget[0] : resolvedTarget) : null;
          if (isSignalValue(target)) {
            handler = async () => {
              const scope = new Env(environment);
              scope.def(targetName, Expr.value(target.peek(), parentTokenInfo));
              const nextTokens = await Eval.do(handlerToken.getBody(), scope, "On", true, parentTokenInfo);
              if (!nextTokens.length)
                return;
              const nextValue = toPlain(nextTokens.length === 1 ? nextTokens[0] : nextTokens);
              target.set(nextValue);
            };
          }
        }
      }
      if (!handler) {
        const [resolvedHandlerToken] = await Eval.do([handlerToken], environment, "Expr", true, parentTokenInfo);
        const resolvedHandler = resolvedHandlerToken ? toPlain(resolvedHandlerToken) : null;
        handler = typeof resolvedHandler === "function" ? resolvedHandler : () => {};
      }
      const shadowRoot = hasShadow ? resolveShadowHost(typeof shadowSelector !== "undefined" ? shadowSelector : undefined).shadowRoot : undefined;
      const onKey = `${eventName}::${selector}::${hasShadow ? typeof shadowSelector !== "undefined" ? shadowSelector : "__last_shadow__" : "document"}`;
      const previousOn = onDisposers.get(onKey);
      if (typeof previousOn === "function")
        previousOn();
      onDisposers.set(onKey, on(eventName, selector, handler, shadowRoot));
      isDone2 = true;
    }
    if (value.loop instanceof Expr.LoopStatement) {
      const body = value.loop.getBody();
      for (let i2 = 0, c2 = body.length;i2 < c2; i2++) {
        let range;
        let args;
        if (isBlock(body[i2])) {
          if (isBlock(body[i2].head())) {
            const [head2, ...tail2] = body[i2].getBody();
            range = [head2];
            args = tail2;
          } else {
            range = body[i2].getBody();
            args = [];
          }
        } else {
          range = [body[i2]];
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
      let cases = fixedMatches.map((x2) => isBlock(x2) ? x2.getBody() : [x2]);
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
        } catch (e2) {
          if (!value.rescue)
            throw e2;
          failure = e2;
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
            for (let i2 = 0, c2 = subBody.length;!isDone2 && i2 < c2; i2++) {
              let fixedBody = isBlock(subBody[i2]) ? subBody[i2].getBody() : [subBody[i2]];
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
        for (let i2 = 0, c2 = keys2.length;i2 < c2; i2++) {
          const subBody = value[keys2[i2]].getBody();
          const fixedBody = await Eval.do(subBody, environment, "Prop", true, parentTokenInfo);
          value[keys2[i2]] = Expr.stmt(fixedBody, parentTokenInfo);
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
  } catch (e2) {
    if (!environment)
      throw e2;
    error = e2;
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
  } catch (e2) {
    failure = failure || e2;
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
function createEnv(runtime, adapter, options = {}) {
  applyAdapter(runtime, adapter, options);
  return new runtime.Env(options.parent);
}
// src/compiler/atoms.js
var SPACE_SCALE = {
  0: "0",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  px: "1px",
  auto: "auto"
};
var OPACITY_SCALE = {
  0: "0",
  50: "0.5",
  100: "1"
};
var COLORS = {
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
  current: "currentColor",
  "gray-100": "#f3f4f6",
  "gray-200": "#e5e7eb",
  "gray-300": "#d1d5db",
  "gray-400": "#9ca3af",
  "gray-500": "#6b7280",
  "gray-600": "#4b5563",
  "gray-700": "#374151",
  "gray-800": "#1f2937",
  "gray-900": "#111827",
  "blue-100": "#dbeafe",
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "blue-700": "#1d4ed8",
  "red-500": "#ef4444",
  "red-600": "#dc2626",
  "green-500": "#22c55e",
  "green-600": "#16a34a",
  "yellow-500": "#eab308",
  "purple-500": "#a855f7",
  "pink-500": "#ec4899"
};
var STATIC_RULES = {
  flex: "display:flex",
  grid: "display:grid",
  block: "display:block",
  inline: "display:inline",
  "inline-flex": "display:inline-flex",
  "inline-block": "display:inline-block",
  hidden: "display:none",
  "flex-col": "flex-direction:column",
  "flex-row": "flex-direction:row",
  "flex-wrap": "flex-wrap:wrap",
  "flex-1": "flex:1 1 0%",
  "flex-auto": "flex:1 1 auto",
  "flex-none": "flex:none",
  "items-start": "align-items:flex-start",
  "items-center": "align-items:center",
  "items-end": "align-items:flex-end",
  "items-stretch": "align-items:stretch",
  "justify-start": "justify-content:flex-start",
  "justify-center": "justify-content:center",
  "justify-end": "justify-content:flex-end",
  "justify-between": "justify-content:space-between",
  "justify-around": "justify-content:space-around",
  "w-full": "width:100%",
  "w-screen": "width:100vw",
  "w-auto": "width:auto",
  "h-full": "height:100%",
  "h-screen": "height:100vh",
  "h-auto": "height:auto",
  "min-w-0": "min-width:0",
  "min-h-0": "min-height:0",
  "text-xs": "font-size:0.75rem;line-height:1rem",
  "text-sm": "font-size:0.875rem;line-height:1.25rem",
  "text-base": "font-size:1rem;line-height:1.5rem",
  "text-lg": "font-size:1.125rem;line-height:1.75rem",
  "text-xl": "font-size:1.25rem;line-height:1.75rem",
  "text-2xl": "font-size:1.5rem;line-height:2rem",
  "text-3xl": "font-size:1.875rem;line-height:2.25rem",
  "text-4xl": "font-size:2.25rem;line-height:2.5rem",
  "font-light": "font-weight:300",
  "font-normal": "font-weight:400",
  "font-medium": "font-weight:500",
  "font-semibold": "font-weight:600",
  "font-bold": "font-weight:700",
  "text-left": "text-align:left",
  "text-center": "text-align:center",
  "text-right": "text-align:right",
  uppercase: "text-transform:uppercase",
  lowercase: "text-transform:lowercase",
  capitalize: "text-transform:capitalize",
  truncate: "overflow:hidden;text-overflow:ellipsis;white-space:nowrap",
  border: "border-width:1px;border-style:solid",
  "border-0": "border-width:0",
  "border-t": "border-top-width:1px;border-top-style:solid",
  "border-b": "border-bottom-width:1px;border-bottom-style:solid",
  rounded: "border-radius:0.25rem",
  "rounded-md": "border-radius:0.375rem",
  "rounded-lg": "border-radius:0.5rem",
  "rounded-xl": "border-radius:0.75rem",
  "rounded-full": "border-radius:9999px",
  "rounded-none": "border-radius:0",
  shadow: "box-shadow:0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)",
  "shadow-md": "box-shadow:0 4px 6px rgba(0,0,0,0.1),0 2px 4px rgba(0,0,0,0.06)",
  "shadow-lg": "box-shadow:0 10px 15px rgba(0,0,0,0.1),0 4px 6px rgba(0,0,0,0.05)",
  "shadow-none": "box-shadow:none",
  relative: "position:relative",
  absolute: "position:absolute",
  fixed: "position:fixed",
  sticky: "position:sticky",
  "inset-0": "top:0;right:0;bottom:0;left:0",
  "overflow-hidden": "overflow:hidden",
  "overflow-auto": "overflow:auto",
  "overflow-scroll": "overflow:scroll",
  "cursor-pointer": "cursor:pointer",
  "cursor-default": "cursor:default",
  "select-none": "user-select:none",
  "pointer-events-none": "pointer-events:none",
  "box-border": "box-sizing:border-box",
  "sr-only": "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0"
};
function escapeClassName(value) {
  return String(value).replace(/\//g, "\\/");
}
function makeRule(className, declaration) {
  return `.${escapeClassName(className)}{${declaration}}`;
}
function resolveSpaceDeclaration(kind, axis, value) {
  if (!Object.prototype.hasOwnProperty.call(SPACE_SCALE, value))
    return null;
  const cssValue = SPACE_SCALE[value];
  const longhand = kind === "p" ? ["padding"] : kind === "m" ? ["margin"] : ["gap"];
  if (kind === "gap") {
    if (!axis)
      return `gap:${cssValue}`;
    if (axis === "x")
      return `column-gap:${cssValue}`;
    if (axis === "y")
      return `row-gap:${cssValue}`;
    return null;
  }
  if (!axis)
    return `${longhand[0]}:${cssValue}`;
  const map2 = {
    x: [`${longhand[0]}-left`, `${longhand[0]}-right`],
    y: [`${longhand[0]}-top`, `${longhand[0]}-bottom`],
    t: [`${longhand[0]}-top`],
    r: [`${longhand[0]}-right`],
    b: [`${longhand[0]}-bottom`],
    l: [`${longhand[0]}-left`]
  };
  if (!map2[axis])
    return null;
  return map2[axis].map((prop) => `${prop}:${cssValue}`).join(";");
}
function resolveColorDeclaration(kind, colorName) {
  if (!Object.prototype.hasOwnProperty.call(COLORS, colorName))
    return null;
  const value = COLORS[colorName];
  if (kind === "text")
    return `color:${value}`;
  if (kind === "bg")
    return `background-color:${value}`;
  if (kind === "border")
    return `border-color:${value}`;
  return null;
}
function atomicRule(className) {
  if (Object.prototype.hasOwnProperty.call(STATIC_RULES, className)) {
    return makeRule(className, STATIC_RULES[className]);
  }
  const opacity = /^opacity-(0|50|100)$/.exec(className);
  if (opacity)
    return makeRule(className, `opacity:${OPACITY_SCALE[opacity[1]]}`);
  const spacing = /^(p|m|gap)(x|y|t|r|b|l)?-(.+)$/.exec(className);
  if (spacing) {
    const declaration = resolveSpaceDeclaration(spacing[1], spacing[2], spacing[3]);
    if (declaration)
      return makeRule(className, declaration);
  }
  const color = /^(text|bg|border)-(.+)$/.exec(className);
  if (color) {
    const declaration = resolveColorDeclaration(color[1], color[2]);
    if (declaration)
      return makeRule(className, declaration);
  }
  return null;
}
function generateAtomicCss(classSet) {
  if (!classSet || !classSet.size)
    return "";
  const css = [];
  classSet.forEach((className) => {
    const rule = atomicRule(className);
    if (rule)
      css.push(rule);
  });
  return css.join(`
`);
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
function splitStatements(tokens) {
  const out = [];
  let current2 = [];
  tokens.forEach((token) => {
    if (token.type === EOL) {
      if (current2.length)
        out.push(current2);
      current2 = [];
      return;
    }
    current2.push(token);
  });
  if (current2.length)
    out.push(current2);
  return out;
}
function preserveMarkdownLine(line) {
  return String(line || "").replace(/\s+$/, "");
}
function normalizeProseBlock(lines) {
  const out = [];
  lines.forEach((line) => {
    const isEmpty = !line.trim().length;
    const prev = out[out.length - 1];
    const prevIsEmpty = typeof prev === "string" && !prev.trim().length;
    if (isEmpty && (!out.length || prevIsEmpty))
      return;
    out.push(line);
  });
  while (out.length && !out[0].trim().length)
    out.shift();
  while (out.length && !out[out.length - 1].trim().length)
    out.pop();
  return out;
}
function normalizeDirectiveArgs(body) {
  if (!Array.isArray(body))
    return [];
  const flat = body.length === 1 && body[0] && body[0].type === BLOCK && body[0].hasBody ? body[0].getBody() : body;
  return flat.filter((token) => token && token.type !== COMMA);
}
function collectProseComments(source, statementCount) {
  const sourceLines = String(source || "").split(`
`);
  const raw = Parser.getAST(source, null);
  const commentsByStatement = Array.from({ length: statementCount }, () => []);
  const ranges = [];
  let currentStart = null;
  let currentEnd = null;
  raw.forEach((token) => {
    if (token.type === EOF)
      return;
    if (token.type === EOL) {
      if (currentStart !== null) {
        const line2 = Number.isFinite(token.line) ? token.line : currentEnd;
        ranges.push({ start: currentStart, end: line2 });
        currentStart = null;
        currentEnd = null;
      }
      return;
    }
    if (token.type === TEXT || token.type === COMMENT || token.type === COMMENT_MULTI)
      return;
    const line = Number.isFinite(token.line) ? token.line : null;
    if (line === null)
      return;
    if (currentStart === null) {
      currentStart = line;
      currentEnd = line;
      return;
    }
    currentEnd = Math.max(currentEnd, line);
  });
  if (currentStart !== null) {
    ranges.push({ start: currentStart, end: currentEnd });
  }
  let cursor = 0;
  ranges.slice(0, statementCount).forEach((range, index) => {
    const prose = sourceLines.slice(cursor, range.start).map(preserveMarkdownLine);
    commentsByStatement[index] = normalizeProseBlock(prose);
    cursor = range.end + 1;
  });
  return commentsByStatement;
}
function splitByEol(tokens) {
  const out = [];
  let current2 = [];
  (tokens || []).forEach((token) => {
    if (token.type === EOL) {
      if (current2.length)
        out.push(current2);
      current2 = [];
      return;
    }
    current2.push(token);
  });
  if (current2.length)
    out.push(current2);
  return out;
}
function getRuntimeSiblingPath(runtimePath, moduleName) {
  if (runtimePath.endsWith("/runtime")) {
    return `${runtimePath.slice(0, -"/runtime".length) || "."}/${moduleName}`.replace("//", "/");
  }
  if (runtimePath.endsWith("/runtime/index.js")) {
    return `${runtimePath.slice(0, -"/runtime/index.js".length) || "."}/${moduleName}`.replace("//", "/");
  }
  if (runtimePath === "./runtime")
    return `./${moduleName}`;
  if (runtimePath === "10x/runtime")
    return `10x/${moduleName}`;
  return `./${moduleName}`;
}
function getPreludePath(runtimePath) {
  return getRuntimeSiblingPath(runtimePath, "prelude");
}
function getCoreRuntimePath(runtimePath) {
  if (runtimePath.startsWith("./") || runtimePath.startsWith("../"))
    return runtimePath;
  if (runtimePath.endsWith("/runtime"))
    return `${runtimePath}/core`;
  if (runtimePath.endsWith("/runtime/index.js"))
    return `${runtimePath.slice(0, -"/index.js".length)}/core.js`;
  return runtimePath;
}
function toTokenLike(node) {
  if (!node)
    return node;
  if (node.type)
    return node;
  if (typeof node === "string") {
    if (/^-?\d+(\.\d+)?$/.test(node))
      return { isNumber: true, value: node };
    return { isLiteral: true, value: node };
  }
  if (typeof node === "number") {
    return { isNumber: true, value: String(node) };
  }
  if (typeof node === "object" && Object.prototype.hasOwnProperty.call(node, "value")) {
    return toTokenLike(node.value);
  }
  return node;
}
function splitArgGroups(args) {
  const groups = [];
  let current2 = [];
  (args || []).forEach((token) => {
    if (token.type === COMMA) {
      if (current2.length)
        groups.push(current2);
      current2 = [];
      return;
    }
    current2.push(token);
  });
  if (current2.length)
    groups.push(current2);
  return groups;
}
function unwrapSingleBodyBlock(token) {
  let current2 = token;
  while (current2 && current2.type === BLOCK && current2.hasBody && !current2.hasArgs && current2.getBody().length === 1) {
    [current2] = current2.getBody();
  }
  return current2;
}
function extractPostUpdatePartsFromArgs(args, ctx) {
  if (!Array.isArray(args))
    return null;
  if (args.length !== 2)
    return null;
  const [targetToken, updateToken] = args;
  if (!(targetToken && targetToken.isLiteral && typeof targetToken.value === "string"))
    return null;
  const target = String(targetToken.value);
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(target))
    return null;
  if (!(updateToken && updateToken.isObject && updateToken.value && updateToken.value.let && updateToken.value.let.hasBody))
    return null;
  const [entryRaw] = updateToken.value.let.getBody();
  const entry = unwrapSingleBodyBlock(entryRaw);
  if (!(entry && entry.isCallable && entry.getName && entry.getName() === target && entry.hasBody))
    return null;
  const rhs = compileExpression(entry.getBody(), { ...ctx, autoPrintExpressions: false, exportDefinitions: false });
  return { target, rhs };
}
function isQuestionToken(token) {
  return !!token && (token.type === SOME || token.isLiteral && token.value === "?");
}
function isPipeChoiceToken(token) {
  return !!token && (token.type === OR || token.isLiteral && token.value === "|");
}
function collectImportSpecs(statements, runtimePath) {
  const imports = [];
  const globals = [];
  const seenImport = new Set;
  const seenGlobal = new Set;
  statements.forEach((tokens) => {
    if (tokens.length !== 1)
      return;
    const [token] = tokens;
    if (!token.isObject || !token.value || !token.value.import)
      return;
    const fromBody = token.value.from && token.value.from.getBody ? token.value.from.getBody() : [];
    const source = fromBody[0] && typeof fromBody[0].value === "string" ? fromBody[0].value : null;
    const importToken = token.value.import;
    const importBodyRaw = importToken && importToken.getBody ? importToken.getBody() : [];
    const importBody = importBodyRaw.length === 1 && importBodyRaw[0] && importBodyRaw[0].type === BLOCK && importBodyRaw[0].hasBody ? importBodyRaw[0].getBody() : importBodyRaw;
    const specifiers = (importBody.length ? importBody.filter((x2) => x2 && x2.type !== COMMA).map((x2) => x2.value) : [importToken && importToken.value]).filter(Boolean);
    if (!specifiers.length)
      return;
    if (source === "Prelude" || source === "IO" || source === "Proc" || source === "Array" && specifiers.includes("concat")) {
      const modulePath = source === "Prelude" ? getPreludePath(runtimePath) : source === "IO" ? getRuntimeSiblingPath(runtimePath, "io") : source === "Proc" ? getRuntimeSiblingPath(runtimePath, "proc") : getPreludePath(runtimePath);
      const preludeSpecifiers = source === "Prelude" ? specifiers : source === "IO" || source === "Proc" ? specifiers : specifiers.filter((x2) => x2 === "concat");
      const key = `${modulePath}::${specifiers.join(",")}`;
      if (!seenImport.has(key)) {
        imports.push({ source: modulePath, specifiers: preludeSpecifiers });
        seenImport.add(key);
      }
      if (source === "Array") {
        const remaining = specifiers.filter((x2) => x2 !== "concat");
        if (!remaining.length)
          return;
        const gKey = `${source}::${remaining.join(",")}`;
        if (!seenGlobal.has(gKey)) {
          globals.push({ source, specifiers: remaining });
          seenGlobal.add(gKey);
        }
        return;
      }
      return;
    }
    if (source && /^[A-Z][A-Za-z0-9_]*$/.test(source)) {
      const key = `${source}::${specifiers.join(",")}`;
      if (!seenGlobal.has(key)) {
        globals.push({ source, specifiers });
        seenGlobal.add(key);
      }
    }
  });
  return { imports, globals };
}
function collectNeedsDom(statements) {
  return statements.some((tokens) => {
    if (tokens.length !== 1)
      return false;
    const [token] = tokens;
    if (!token.isObject || !token.value)
      return false;
    return !!(token.value.render || token.value.on || token.value.shadow || token.value.style);
  });
}
function collectPrintStatements(source) {
  const raw = Parser.getAST(source, null);
  const printIdx = new Set;
  let idx = 0;
  let seenCode = false;
  let seenPrint = false;
  raw.forEach((token) => {
    if (token.type === EOF)
      return;
    if (token.type === EOL) {
      if (seenCode) {
        if (seenPrint)
          printIdx.add(idx);
        idx++;
      }
      seenCode = false;
      seenPrint = false;
      return;
    }
    if (token.type === TEXT || token.type === COMMENT || token.type === COMMENT_MULTI)
      return;
    seenCode = true;
    if (token.type === NOT)
      seenPrint = true;
  });
  return printIdx;
}
function quote2(value) {
  return JSON.stringify(String(value));
}
function indentMultiline(value, indent) {
  return String(value).split(`
`).map((line) => `${indent}${line}`).join(`
`);
}
function formatFirstInline(value, indent) {
  const lines = String(value).split(`
`);
  if (lines.length === 1)
    return lines[0];
  return `${lines[0]}
${lines.slice(1).map((line) => `${indent}${line}`).join(`
`)}`;
}
function compileTag(node, depth = 0) {
  const attrEntries = Object.entries(node.attrs || {});
  const attrsStr = attrEntries.length === 0 ? "null" : "{ " + attrEntries.map(([k2, v2]) => {
    if (v2 === true)
      return `${JSON.stringify(k2)}: true`;
    if (v2 && typeof v2 === "object" && typeof v2.expr === "string") {
      const passSignal = /^(d:|s:|class:|style:)/.test(k2) || k2 === "ref";
      return passSignal ? `${JSON.stringify(k2)}: ${v2.expr.trim()}` : `${JSON.stringify(k2)}: $.read(${v2.expr.trim()})`;
    }
    return `${JSON.stringify(k2)}: ${JSON.stringify(String(v2))}`;
  }).join(", ") + " }";
  const childrenParts = (node.children || []).map((child) => {
    if (typeof child === "string")
      return JSON.stringify(child);
    if (child && typeof child.expr === "string")
      return child.expr.trim();
    return compileTag(child, depth + 1);
  });
  if (/^[A-Z]/.test(node.name)) {
    const propsBase = attrsStr === "null" ? "" : attrsStr.slice(2, -2);
    const childrenEntry = childrenParts.length ? `"children": [${childrenParts.join(", ")}]` : "";
    const entries = [propsBase, childrenEntry].filter(Boolean).join(", ");
    return `${node.name}({ ${entries} })`;
  }
  if (!childrenParts.length) {
    return `$.h(${JSON.stringify(node.name)}, ${attrsStr})`;
  }
  const indent = "  ".repeat(depth);
  const childIndent = "  ".repeat(depth + 1);
  const [firstRawChild, ...restRawChildren] = childrenParts;
  const firstChild = formatFirstInline(firstRawChild, childIndent);
  const restChildren = restRawChildren.map((part) => indentMultiline(part, childIndent));
  const rest = restChildren.length ? `,
${restChildren.join(`,
`)}` : "";
  return `$.h(${JSON.stringify(node.name)}, ${attrsStr}, ${firstChild}${rest})`;
}
function compileArgs(args, ctx) {
  if (!Array.isArray(args) || !args.length)
    return "";
  const groups = splitArgGroups(args);
  const hasObjectPair = groups.some((group) => group.length === 2 && (group[0].type === SYMBOL || group[0].isString));
  const isObjectArg = hasObjectPair && groups.every((group) => group.length === 2 && (group[0].type === SYMBOL || group[0].isString) || group.length === 1 && (group[0].isObject || group[0].isLiteral && typeof group[0].value === "object"));
  if (isObjectArg) {
    return `{ ${groups.map((group) => {
      if (group.length === 1)
        return `...${compileToken(group[0], ctx)}`;
      const keyRaw = String(group[0].value || "").replace(/^:/, "");
      return `${JSON.stringify(keyRaw)}: ${compileToken(group[1], ctx)}`;
    }).join(", ")} }`;
  }
  return groups.map((group) => {
    const post = extractPostUpdatePartsFromArgs(group, ctx);
    if (post) {
      return `(() => { const __prev = ${post.target}; ${post.target} = ${post.rhs}; return __prev; })()`;
    }
    if (group.some((token) => token.type === EOL)) {
      const nested = splitByEol(group);
      const localCtx = { ...ctx, autoPrintExpressions: false, exportDefinitions: false };
      const head2 = nested.slice(0, -1).map((stmt) => compileStatement(stmt, localCtx, -1));
      const tail2 = compileStatement(nested[nested.length - 1], localCtx, -1).replace(/;\s*$/, "");
      return `(() => { ${head2.join(" ")} return ${tail2}; })()`;
    }
    const hasOperator = group.some((token) => OPERATOR.get(token.type));
    const hasCall = group.some((token) => token.type === BLOCK && token.hasArgs);
    if (!hasOperator && !hasCall && group.length > 1) {
      return `[${group.map((token) => compileToken(token, ctx)).join(", ")}]`;
    }
    return compileExpression(group, ctx);
  }).join(", ");
}
function compileLambda(token, ctx) {
  const args = token.hasArgs ? token.getArgs().map((arg) => compileToken(arg, ctx)).join(", ") : "";
  const body = token.hasBody ? compileExpression(token.getBody(), ctx) : "undefined";
  return `(${args}) => (${body})`;
}
function compileToken(token, ctx = { signalVars: new Set }) {
  if (token && token.isObject) {
    const value = token.value || {};
    const keys2 = Object.keys(value);
    const directiveKeys = [
      "render",
      "on",
      "html",
      "signal",
      "computed",
      "prop",
      "if",
      "else",
      "do",
      "let",
      "match",
      "while",
      "loop",
      "try",
      "rescue",
      "export",
      "import",
      "from",
      "style"
    ];
    const isDirective2 = keys2.some((k2) => directiveKeys.includes(k2));
    if (isDirective2)
      return compileDirectiveObject(token, ctx);
    const pairs2 = keys2.map((key) => {
      const body = value[key] && value[key].getBody ? value[key].getBody() : [];
      const rhs = body.length ? compileExpression(body, ctx) : "undefined";
      return `${JSON.stringify(key)}: ${rhs}`;
    });
    return `{ ${pairs2.join(", ")} }`;
  }
  if (token.isTag) {
    return compileTag(token.value);
  }
  if (token.isCallable && !token.getName()) {
    return compileLambda(token, ctx);
  }
  if (token.isNumber) {
    return token.value;
  }
  if (token.isString) {
    if (Array.isArray(token.value)) {
      return compileExpression(token.value, ctx);
    }
    return quote2(token.value);
  }
  if (token.type === BLOCK && token.hasArgs && !token.hasBody) {
    const groups = splitArgGroups(token.getArgs());
    const objectLike = groups.length && groups.every((group) => group.length === 2 && (group[0].type === SYMBOL || group[0].isString));
    if (objectLike) {
      const pairs2 = groups.map((group) => {
        const keyRaw = String(group[0].value || "").replace(/^:/, "");
        return `${JSON.stringify(keyRaw)}: ${compileToken(group[1], ctx)}`;
      });
      return `{ ${pairs2.join(", ")} }`;
    }
    return `(${compileArgs(token.getArgs(), ctx)})`;
  }
  if (token.type === BLOCK && token.hasBody && !token.isCallable) {
    const body = token.getBody();
    const keyValuePair = body.length === 2 && (body[0].type === SYMBOL || body[0].isString) && (body[1].type === SYMBOL || body[1].isString || body[1].isLiteral);
    if (keyValuePair) {
      const keyRaw = String(body[0].value || "").replace(/^:/, "");
      return `{ ${JSON.stringify(keyRaw)}: ${compileToken(body[1], ctx)} }`;
    }
    return `(${compileExpression(body, ctx)})`;
  }
  if (token.type === SYMBOL) {
    const value = String(token.value || "").replace(/^:/, "");
    return quote2(value);
  }
  if (token.type === RANGE) {
    if (Array.isArray(token.value)) {
      const items2 = token.value.map(toTokenLike).filter((x2) => {
        if (!x2)
          return false;
        if (x2.type === COMMA)
          return false;
        return !(x2.isLiteral && x2.value === ",");
      });
      if (items2.some((x2) => x2.type === DOT)) {
        return `(${compileExpression(items2, ctx)})`;
      }
      return `[${items2.map((x2) => compileToken(x2, ctx)).join(", ")}]`;
    }
    if (token.value && Array.isArray(token.value.begin)) {
      const begin = token.value.begin.map((x2) => compileToken(x2, ctx)).join(", ");
      const end = Array.isArray(token.value.end) && token.value.end.length ? `, ${token.value.end.map((x2) => compileToken(x2, ctx)).join(", ")}` : "";
      return `range(${begin}${end})`;
    }
  }
  if (token.isLiteral) {
    if (token.value === null)
      return "null";
    if (token.value === true)
      return "true";
    if (token.value === false)
      return "false";
    if (typeof token.value === "string") {
      if (token.value === "|")
        return "||";
      if (token.value === "?")
        return "?";
      if (ctx.signalVars.has(token.value))
        return `$.read(${token.value})`;
      return token.value;
    }
    if (token.value && typeof token.value === "object") {
      if (Object.prototype.hasOwnProperty.call(token.value, "value")) {
        return compileToken(token.value, ctx);
      }
      if (Array.isArray(token.value.body)) {
        return compileExpression(token.value.body, ctx);
      }
      if (Array.isArray(token.value.args)) {
        return `(${compileArgs(token.value.args, ctx)})`;
      }
    }
    return JSON.stringify(token.value);
  }
  if (token.type === SOME) {
    const target = compileToken(token.value, ctx);
    return `(${target} != null)`;
  }
  if (token.type === EVERY) {
    const target = compileToken(token.value, ctx);
    return `${target}.every(Boolean)`;
  }
  if (token.type === NOT && token.value !== "!") {
    return "!";
  }
  if (token.type === LIKE && Array.isArray(token.value) && token.value.length >= 2) {
    const parts = token.value.map(toTokenLike).filter(Boolean);
    const leftTokens = parts.length > 2 ? parts.slice(0, -1) : [parts[0]];
    const rightToken = parts.length > 2 ? parts[parts.length - 1] : parts[1];
    const left = leftTokens.length > 1 ? compileExpression(leftTokens, ctx) : compileToken(leftTokens[0], ctx);
    const right = compileToken(rightToken, ctx);
    return `(String(${left}).includes(String(${right})))`;
  }
  if (token.type === BLOCK && token.hasBody && token.isCallable) {
    return compileLambda(token, ctx);
  }
  const op = OPERATOR.get(token.type);
  if (op) {
    if (Array.isArray(token.value)) {
      return token.value.map((x2) => compileToken(x2, ctx)).join(` ${op} `);
    }
    return op;
  }
  throw new Error(`Unsupported token in compiler: ${String(token.type)}`);
}
function compileExpression(tokens, ctx = { signalVars: new Set }) {
  const qIndex = tokens.findIndex(isQuestionToken);
  if (qIndex > 0) {
    const elseIndex = tokens.findIndex((token, index) => index > qIndex && isPipeChoiceToken(token));
    if (elseIndex > qIndex) {
      const cond = tokens.slice(0, qIndex);
      const thenBranch = tokens.slice(qIndex + 1, elseIndex);
      const elseBranch = tokens.slice(elseIndex + 1);
      return `((${compileExpression(cond, ctx)}) ? (${compileExpression(thenBranch, ctx)}) : (${compileExpression(elseBranch, ctx)}))`;
    }
  }
  const out = [];
  for (let i2 = 0;i2 < tokens.length; i2++) {
    const token = tokens[i2];
    const next = tokens[i2 + 1];
    const prev = tokens[i2 - 1];
    if (token.type === PIPE) {
      const left = out.pop();
      const rhs = tokens[i2 + 1];
      const rhsNext = tokens[i2 + 2];
      if (rhs && rhs.isLiteral && rhsNext && rhsNext.type === BLOCK && rhsNext.hasArgs) {
        const args = rhsNext.getArgs().filter((x2) => x2.type !== COMMA).map((x2) => compileToken(x2, ctx));
        out.push(`${compileToken(rhs, ctx)}(${[left].concat(args).join(", ")})`);
        i2 += 2;
        continue;
      }
      if (rhs && rhs.isLiteral) {
        out.push(`${compileToken(rhs, ctx)}(${left})`);
        i2 += 1;
        continue;
      }
    }
    if (token.type === BLOCK && token.hasArgs && !token.hasBody && prev && (prev.isLiteral || prev.isTag || prev.type === BLOCK && prev.hasArgs)) {
      if (prev.isString && prev.value === "" && out.length >= 2) {
        const indexExpr = compileArgs(token.getArgs(), ctx);
        out.pop();
        out[out.length - 1] = `${out[out.length - 1]}[${indexExpr}]`;
        continue;
      }
      out[out.length - 1] = `${out[out.length - 1]}(${compileArgs(token.getArgs(), ctx)})`;
      continue;
    }
    if (token.type === SYMBOL && token.value === ":" && next && next.type === BLOCK && next.hasArgs && out.length) {
      const key = compileArgs(next.getArgs(), ctx);
      out[out.length - 1] = `${out[out.length - 1]}[${key}]`;
      i2 += 1;
      continue;
    }
    if (token.type === DOT && next && next.isLiteral) {
      out.push(".");
      continue;
    }
    out.push(compileToken(token, ctx));
  }
  return out.join(" ").replace(/\s+\./g, ".").replace(/\.\s+/g, ".");
}
function compileHandler(token, ctx) {
  const callable = (() => {
    if (token && token.isCallable && token.getName())
      return token;
    if (token && token.type === BLOCK && token.hasBody) {
      const [first] = token.getBody();
      if (first && first.isCallable && first.getName())
        return first;
    }
    return null;
  })();
  if (callable) {
    if (ctx.signalVars.has(callable.getName())) {
      return `() => { ${callable.getName()}.set(${compileExpression(callable.getBody(), ctx)}); }`;
    }
    return `() => { ${compileDefinition(callable, true, { ...ctx, exportDefinitions: false, autoPrintExpressions: false })} }`;
  }
  if (token && token.type === BLOCK && token.hasBody) {
    return `() => (${compileExpression(token.getBody(), ctx)})`;
  }
  return `() => (${compileToken(token, ctx)})`;
}
function compileSignalDirective(body, ctx) {
  return `$.signal(${compileExpression(body, ctx)})`;
}
function compileIfDirective(value, ctx) {
  const branches = value.if && value.if.getBody ? value.if.getBody() : [];
  const elseBody = value.else && value.else.getBody ? value.else.getBody() : [];
  const branchExprs = branches.map((branch) => {
    const body = branch && branch.hasBody ? branch.getBody() : [];
    const [cond, ...rest] = body;
    return {
      cond: cond ? compileExpression([cond], ctx) : "false",
      thenExpr: rest.length ? compileExpression(rest, ctx) : "undefined"
    };
  });
  let out = elseBody.length ? compileExpression(elseBody, ctx) : "undefined";
  for (let i2 = branchExprs.length - 1;i2 >= 0; i2--) {
    out = `((${branchExprs[i2].cond}) ? (${branchExprs[i2].thenExpr}) : (${out}))`;
  }
  return out;
}
function compileDoDirective(body, ctx) {
  const [block] = body;
  const statements = block && block.hasBody ? splitByEol(block.getBody()) : [];
  if (!statements.length)
    return "(() => undefined)()";
  const localCtx = { ...ctx, exportDefinitions: false, autoPrintExpressions: false };
  const head2 = statements.slice(0, -1).map((stmt) => compileStatement(stmt, localCtx, -1));
  const tail2 = compileStatement(statements[statements.length - 1], localCtx, -1).replace(/;\s*$/, "");
  return `(() => { ${head2.join(" ")} return ${tail2}; })()`;
}
function compileLetDirective(body, ctx) {
  const items2 = (body || []).flatMap((part) => part && part.hasBody ? part.getBody() : [part]).filter(Boolean);
  if (!items2.length)
    return "undefined";
  const mode = ctx.letMode || "declare";
  const assignOne = (entry) => {
    if (entry && entry.isCallable && entry.getName()) {
      const left = entry.getName();
      const rhs = compileExpression(entry.getBody(), { ...ctx, exportDefinitions: false, autoPrintExpressions: false });
      if (mode === "assign")
        return `(${left} = ${rhs})`;
      return `let ${left} = ${rhs}`;
    }
    return compileToken(entry, { ...ctx, autoPrintExpressions: false });
  };
  const exprs = items2.map(assignOne);
  if (mode === "assign") {
    return exprs[exprs.length - 1];
  }
  return exprs.join("; ");
}
function compileMatchDirective(body, ctx) {
  const [block] = body;
  const tokens = block && block.hasBody ? block.getBody() : [];
  if (!tokens.length)
    return "undefined";
  const key = compileToken(tokens[0], ctx);
  const pairs2 = [];
  let elseExpr = "undefined";
  for (let i2 = 1;i2 < tokens.length; i2++) {
    const token = tokens[i2];
    if (token.type === COMMA)
      continue;
    if (token.isObject && token.value && token.value.else) {
      elseExpr = compileExpression(token.value.else.getBody(), ctx);
      continue;
    }
    const next = tokens[i2 + 1];
    if (!next)
      break;
    pairs2.push({ when: compileToken(token, ctx), thenExpr: compileToken(next, ctx) });
    i2++;
  }
  let out = elseExpr;
  for (let i2 = pairs2.length - 1;i2 >= 0; i2--) {
    out = `(${key} === ${pairs2[i2].when} ? ${pairs2[i2].thenExpr} : ${out})`;
  }
  return out;
}
function compileWhileDirective(body, ctx) {
  const tokens = (body || []).flatMap((part) => part && part.hasBody ? part.getBody() : [part]).filter(Boolean);
  const [cond, ...rest] = tokens;
  const condition = cond ? compileExpression([cond], { ...ctx, letMode: "assign", autoPrintExpressions: false }) : "false";
  const innerParts = rest.map((token) => {
    if (token && token.isCallable && token.getName()) {
      return `${token.getName()} = ${compileExpression(token.getBody(), { ...ctx, autoPrintExpressions: false })};`;
    }
    return `${compileToken(token, { ...ctx, letMode: "assign", autoPrintExpressions: false })};`;
  });
  const tail2 = innerParts.length ? innerParts[innerParts.length - 1].replace(/;\s*$/, "") : "undefined";
  const bodyLines = innerParts.slice(0, -1).join(" ");
  return `(() => { let __whileResult; while (${condition}) { ${bodyLines} __whileResult = ${tail2}; } return __whileResult; })()`;
}
function compileLoopDirective(body, ctx) {
  const [block] = body;
  const tokens = block && block.hasBody ? block.getBody() : [];
  const [iterableToken, fnToken] = tokens;
  const iterable = iterableToken && iterableToken.hasArgs ? compileArgs(iterableToken.getArgs(), ctx) : compileToken(iterableToken, ctx);
  if (!fnToken || !fnToken.isCallable)
    return `for (const _ of ${iterable}) {}`;
  const args = fnToken.hasArgs ? fnToken.getArgs().map((arg) => compileToken(arg, ctx)).join(", ") : "_";
  const bodyExpr = fnToken.hasBody ? compileExpression(fnToken.getBody(), { ...ctx, autoPrintExpressions: false }) : "undefined";
  return `for (const ${args} of ${iterable}) { ${bodyExpr}; }`;
}
function compileTryDirective(value, ctx) {
  const tryBody = value.try && value.try.getBody ? value.try.getBody() : [];
  const rescueBody = value.rescue && value.rescue.getBody ? value.rescue.getBody() : [];
  const tryExpr = tryBody.length ? compileExpression(tryBody, { ...ctx, autoPrintExpressions: false }) : "undefined";
  let rescueArg = "error";
  let rescueExpr = "undefined";
  if (rescueBody.length) {
    let [first] = rescueBody;
    if (first && first.type === BLOCK && first.hasBody && first.getBody().length === 1) {
      [first] = first.getBody();
    }
    if (first && first.isCallable) {
      rescueArg = first.hasArgs && first.getArgs().length ? compileToken(first.getArgs()[0], ctx) : rescueArg;
      rescueExpr = first.hasBody ? compileExpression(first.getBody(), { ...ctx, autoPrintExpressions: false }) : rescueExpr;
    } else {
      rescueExpr = compileExpression(rescueBody, { ...ctx, autoPrintExpressions: false });
    }
  }
  return `(() => { try { return ${tryExpr}; } catch (${rescueArg}) { return ${rescueExpr}; } })()`;
}
function compileExportDirective(body, ctx) {
  const names = normalizeDirectiveArgs(body).map((token) => compileToken(token, ctx));
  return `export { ${names.join(", ")} }`;
}
function compileHtmlDirective(body, ctx) {
  const [template] = body;
  if (template && template.type === RANGE && Array.isArray(template.value)) {
    const items2 = template.value.filter((token) => token && token.type !== COMMA).map((token) => compileToken(token, ctx));
    return `$.html(() => [${items2.join(", ")}])`;
  }
  if (template && template.type === BLOCK && template.hasBody) {
    const inner = template.getBody();
    if (inner.length > 1) {
      const items2 = inner.map((t) => compileToken(t, ctx));
      return `$.html(() => [${items2.join(", ")}])`;
    }
  }
  return `$.html(() => ${compileToken(template, ctx)})`;
}
function compileComputedDirective(body, ctx) {
  return `$.computed(() => ${compileExpression(body, ctx)})`;
}
function compileStyleDirective(body, ctx) {
  const [arg] = body;
  const hostArg = ctx.shadow ? "host, " : "";
  return `$.style(${hostArg}${compileToken(arg, ctx)})`;
}
function compileHmrFooter() {
  return [
    "if (import.meta.hot) {",
    "  const _hmrUrl = import.meta.url;",
    "  import.meta.hot.dispose(data => {",
    "    data.__signals = {};",
    "    for (const [k, s] of (globalThis.__10x_signals || new Map())) {",
    "      if (typeof k === 'string') data.__signals[k] = s.peek();",
    "    }",
    "  });",
    "  import.meta.hot.accept(newMod => {",
    "    const snap = import.meta.hot.data.__signals || {};",
    "    let _restoredCount = 0;",
    "    for (const [k, s] of (globalThis.__10x_signals || new Map())) {",
    "      if (typeof k === 'string' && snap[k] !== undefined) {",
    "        s.set(snap[k]);",
    "        _restoredCount++;",
    "      }",
    "    }",
    "    if (globalThis.__10x_devtools?.onHmr) {",
    "      globalThis.__10x_devtools.onHmr({ restored: _restoredCount, url: _hmrUrl });",
    "    }",
    "    const hosts = globalThis.__10x_components?.get(_hmrUrl);",
    "    if (hosts && newMod?.setup) {",
    "      hosts.forEach(host => {",
    '        if (host.shadowRoot) host.shadowRoot.innerHTML = "";',
    "        newMod.setup(host);",
    "      });",
    "    }",
    "  });",
    "}"
  ];
}
function compileRenderDirective(body, value, ctx) {
  const htmlExpr = value.html instanceof Object ? compileHtmlDirective(value.html.getBody(), ctx) : "undefined";
  if (value.shadow) {
    const hmrUrlArg = ctx.hmr ? ", import.meta.url" : "";
    return `$.renderShadow(host, ${htmlExpr}${hmrUrlArg})`;
  }
  const selector = body.length ? compileExpression(body, ctx) : "undefined";
  return `$.render(${selector}, ${htmlExpr})`;
}
function compileOnDirective(body, ctx) {
  const [eventToken, selectorToken, handlerToken] = normalizeDirectiveArgs(body);
  const eventName = compileToken(eventToken, ctx);
  const selector = compileToken(selectorToken, ctx);
  const handler = compileHandler(handlerToken, ctx);
  const rootArg = ctx.shadow ? ", host.shadowRoot" : "";
  return `$.on(${eventName}, ${selector}, ${handler}${rootArg})`;
}
function compileOnPropDirective(onBody, propBody, ctx) {
  const [eventToken, selectorToken, handlerToken] = normalizeDirectiveArgs(onBody);
  const eventName = compileToken(eventToken, ctx);
  const selector = compileToken(selectorToken, ctx);
  let signalName;
  if (handlerToken.type === BLOCK && handlerToken.hasBody) {
    const [first] = handlerToken.getBody();
    signalName = first && first.getName ? first.getName() : String(first && first.value);
  } else if (handlerToken.isCallable) {
    signalName = handlerToken.getName();
  } else {
    signalName = String(handlerToken.value);
  }
  const propArgs = propBody[0].getBody();
  const propName = compileToken(propArgs[0], ctx);
  const fallback = compileToken(propArgs[1], ctx);
  const rootArg = ctx.shadow ? ", host.shadowRoot" : "";
  return `$.on(${eventName}, ${selector}, () => { ${signalName}.set($.prop(host, ${propName}, ${fallback})); }${rootArg})`;
}
function compileDirectiveObject(token, ctx) {
  const { value } = token;
  const keys2 = Object.keys(value || {});
  if (keys2.length > 1 && !value.try && !value.if && !value.match && (value.let || value.while || value.loop || value.do)) {
    const statements = [];
    let tail2 = "undefined";
    keys2.forEach((key, idx) => {
      if (key === "rescue" && value.try)
        return;
      const single = { [key]: value[key] };
      const out = compileDirectiveObject({ value: single }, { ...ctx, autoPrintExpressions: false });
      if (!out)
        return;
      if (idx === keys2.length - 1) {
        tail2 = out.replace(/;\s*$/, "");
      } else {
        statements.push(`${out.replace(/;\s*$/, "")};`);
      }
    });
    return `(() => { ${statements.join(" ")} return ${tail2}; })()`;
  }
  if (value.render) {
    return compileRenderDirective(value.render.getBody(), value, ctx);
  }
  if (value.on && value.prop) {
    return compileOnPropDirective(value.on.getBody(), value.prop.getBody(), ctx);
  }
  if (value.on) {
    return compileOnDirective(value.on.getBody(), ctx);
  }
  if (value.if) {
    return compileIfDirective(value, ctx);
  }
  if (value.do) {
    return compileDoDirective(value.do.getBody(), ctx);
  }
  if (value.let) {
    return compileLetDirective(value.let.getBody(), ctx);
  }
  if (value.match) {
    return compileMatchDirective(value.match.getBody(), ctx);
  }
  if (value.while) {
    return compileWhileDirective(value.while.getBody(), ctx);
  }
  if (value.loop) {
    return compileLoopDirective(value.loop.getBody(), ctx);
  }
  if (value.try) {
    return compileTryDirective(value, ctx);
  }
  if (value.export) {
    return compileExportDirective(value.export.getBody(), ctx);
  }
  if (value.else) {
    return compileExpression(value.else.getBody(), ctx);
  }
  if (value.import) {
    return "";
  }
  if (value.html) {
    return compileHtmlDirective(value.html.getBody(), ctx);
  }
  if (value.signal) {
    return compileSignalDirective(value.signal.getBody(), ctx);
  }
  if (value.computed) {
    return compileComputedDirective(value.computed.getBody(), ctx);
  }
  if (value.style) {
    return compileStyleDirective(value.style.getBody(), ctx);
  }
  throw new Error(`Unsupported directive object: ${Object.keys(value).join(", ")}`);
}
function compileDefinition(token, asStatement = false, ctx = { signalVars: new Set }) {
  const name = token.getName();
  const [head2] = token.getBody();
  const declConst = ctx.exportDefinitions ? "export const" : "const";
  const declLet = ctx.exportDefinitions ? "export let" : "let";
  if (!head2)
    return asStatement ? `${declConst} ${name} = undefined;` : `${declConst} ${name} = undefined`;
  if (head2.isCallable) {
    const args = head2.hasArgs ? head2.getArgs().map((arg) => compileToken(arg, ctx)).join(", ") : "";
    const body = head2.hasBody ? compileExpression(head2.getBody(), ctx) : "undefined";
    const out2 = `${declConst} ${name} = (${args}) => (${body})`;
    return asStatement ? `${out2};` : out2;
  }
  if (head2.isObject && head2.value && head2.value.signal) {
    if (head2.value.prop) {
      const propArgs = head2.value.prop.getBody()[0].getBody();
      const propName = compileToken(propArgs[0], ctx);
      const fallback = compileToken(propArgs[1], ctx);
      const out3 = `${declConst} ${name} = $.signal($.prop(host, ${propName}, ${fallback}), ${JSON.stringify(name)})`;
      return asStatement ? `${out3};` : out3;
    }
    const out2 = `${declConst} ${name} = $.signal(${compileExpression(head2.value.signal.getBody(), ctx)}, ${JSON.stringify(name)})`;
    return asStatement ? `${out2};` : out2;
  }
  if (head2.isObject && head2.value && head2.value.computed) {
    const out2 = `${declConst} ${name} = $.computed(() => ${compileExpression(head2.value.computed.getBody(), ctx)})`;
    return asStatement ? `${out2};` : out2;
  }
  const out = `${declLet} ${name} = ${compileExpression(token.getBody(), ctx)}`;
  return asStatement ? `${out};` : out;
}
function compileStatement(tokens, ctx, statementIndex) {
  if (!tokens.length)
    return "";
  const shouldPrint = ctx.printStatements && ctx.printStatements.has(statementIndex);
  const autoPrint = !!ctx.autoPrintExpressions;
  if (tokens.length === 1) {
    const [token] = tokens;
    if (token.isCallable && token.getName()) {
      return `${compileDefinition(token, false, ctx)};`;
    }
    if (token.isObject) {
      const out3 = compileDirectiveObject(token, ctx);
      if (!out3)
        return "";
      return `${out3};`;
    }
    const out2 = compileToken(token, ctx);
    if (shouldPrint || autoPrint)
      return `console.log(${out2});`;
    return `${out2};`;
  }
  const hasOperator = tokens.some((token) => OPERATOR.get(token.type));
  const looksLikeCall = tokens.length === 2 && tokens[0].isLiteral && tokens[1].type === BLOCK && tokens[1].hasArgs && !tokens[1].hasBody;
  if (!hasOperator && !looksLikeCall) {
    const exprs = tokens.map((token) => compileToken(token, ctx)).join(", ");
    if (shouldPrint || autoPrint)
      return `console.log(${exprs});`;
    return `${exprs};`;
  }
  const out = compileExpression(tokens, ctx);
  if (shouldPrint || autoPrint)
    return `console.log(${out});`;
  return `${out};`;
}
function collectShadowFlag(statements) {
  return statements.some((tokens) => {
    if (tokens.length !== 1)
      return false;
    const [token] = tokens;
    return token.isObject && token.value && token.value.shadow;
  });
}
function collectSignalBindings(statements) {
  const signalVars = new Set;
  statements.forEach((tokens) => {
    if (tokens.length !== 1)
      return;
    const [token] = tokens;
    if (!token.isCallable || !token.getName())
      return;
    const [head2] = token.getBody();
    if (head2 && head2.isObject && head2.value && head2.value.signal) {
      signalVars.add(token.getName());
    }
  });
  return signalVars;
}
function collectAtomicClasses(statements) {
  const classes = new Set;
  function pushClassAttr(value) {
    if (typeof value !== "string")
      return;
    value.split(/\s+/).filter(Boolean).forEach((name) => classes.add(name));
  }
  function walkTagNode(node) {
    if (!node || typeof node !== "object")
      return;
    pushClassAttr(node.attrs && node.attrs.class);
    (node.children || []).forEach((child) => {
      if (child && typeof child === "object" && !Array.isArray(child) && child.name) {
        walkTagNode(child);
      }
    });
  }
  function walkToken(token) {
    if (!token || typeof token !== "object")
      return;
    if (token.isTag && token.value) {
      walkTagNode(token.value);
    }
    if (token.value && Array.isArray(token.value.args) && typeof token.getArgs === "function") {
      token.getArgs().forEach(walkToken);
    }
    if (token.value && Array.isArray(token.value.body) && typeof token.getBody === "function") {
      token.getBody().forEach(walkToken);
    }
    if (token.isObject && token.value) {
      Object.values(token.value).forEach((value) => {
        if (value && value.getBody)
          value.getBody().forEach(walkToken);
      });
    }
    if (token.type === RANGE && Array.isArray(token.value)) {
      token.value.forEach(walkToken);
    }
    if (token.isString && Array.isArray(token.value)) {
      token.value.forEach(walkToken);
    }
  }
  statements.forEach((tokens) => tokens.forEach(walkToken));
  return classes;
}
function collectImportSources(statements) {
  const sources = [];
  statements.forEach((tokens) => {
    if (tokens.length !== 1)
      return;
    const [token] = tokens;
    if (!token || !token.isObject || !token.value || !token.value.import || !token.value.from)
      return;
    const fromBody = token.value.from.getBody ? token.value.from.getBody() : [];
    const source = fromBody[0] && typeof fromBody[0].value === "string" ? fromBody[0].value : null;
    if (source)
      sources.push(source);
  });
  return sources;
}
function stripModuleExports(line) {
  if (!line.startsWith("export "))
    return line;
  if (/^export\s+\{.*\}\s*;?$/.test(line))
    return "";
  return line.replace(/^export\s+/, "");
}
function splitImportsAndBody(compiled) {
  const imports = [];
  const body = [];
  String(compiled || "").split(`
`).forEach((line) => {
    if (!line.trim())
      return;
    if (line.startsWith("// Generated by 10x compiler"))
      return;
    if (line.startsWith("import ")) {
      imports.push(line);
      return;
    }
    const normalized = stripModuleExports(line);
    if (!normalized.trim())
      return;
    body.push(normalized);
  });
  return { imports, body };
}
function compile(source, options = {}) {
  const normalized = String(source || "").replace(/\r\n/g, `
`);
  const ast = Parser.getAST(normalized, "parse");
  const statements = splitStatements(ast);
  const hasShadow = collectShadowFlag(statements);
  const needsDom = collectNeedsDom(statements);
  const hmrEnabled = options.hmr === true && options.module !== false;
  const runtimePath = options.runtimePath || "./runtime";
  const { imports, globals } = collectImportSpecs(statements, runtimePath);
  const ctx = {
    signalVars: collectSignalBindings(statements),
    shadow: hasShadow,
    hmr: hmrEnabled,
    exportDefinitions: options.module !== false && !hasShadow && options.exportAll !== false,
    printStatements: collectPrintStatements(normalized),
    autoPrintExpressions: options.autoPrintExpressions !== false && options.module !== false && !hasShadow
  };
  const proseComments = collectProseComments(normalized, statements.length);
  const lines = statements.reduce((prev, tokens, index) => {
    const compiled = compileStatement(tokens, ctx, index);
    const comments = (proseComments[index] || []).map((line) => `// ${line}`);
    if (comments.length)
      prev.push(...comments);
    if (compiled)
      prev.push(compiled);
    return prev;
  }, []);
  const atomicCss = options.atomicCss === false ? "" : generateAtomicCss(collectAtomicClasses(statements));
  if (atomicCss) {
    const hostArg = hasShadow ? "host, " : "";
    lines.unshift(`$.style(${hostArg}${JSON.stringify(atomicCss)});`);
  }
  const requiresRuntime = lines.some((line) => line.includes("$."));
  const usesRange = lines.some((line) => line.includes("range("));
  const output = [];
  if (options.module !== false) {
    output.push("// Generated by 10x compiler (experimental AST backend)");
    if (usesRange && !imports.some((x2) => x2.source === getPreludePath(runtimePath) && x2.specifiers.includes("range"))) {
      imports.push({ source: getPreludePath(runtimePath), specifiers: ["range"] });
    }
    imports.forEach(({ source: importSource, specifiers }) => {
      output.push(`import { ${specifiers.join(", ")} } from ${JSON.stringify(importSource)};`);
    });
    globals.forEach(({ source: globalSource, specifiers }) => {
      output.push(`const { ${specifiers.join(", ")} } = ${globalSource};`);
    });
    if (requiresRuntime) {
      const importPath = needsDom ? runtimePath : getCoreRuntimePath(runtimePath);
      output.push(`import * as $ from ${JSON.stringify(importPath)};`);
    }
  }
  if (hasShadow) {
    output.push("export function setup(host) {");
    output.push(...lines.map((l2) => "  " + l2));
    output.push("}");
  } else {
    output.push(...lines);
  }
  if (hmrEnabled)
    output.push(...compileHmrFooter());
  return output.join(`
`);
}
function compileBundle(entryPath, options = {}) {
  const readFile = options.readFile;
  const resolveModule = options.resolveModule;
  if (typeof readFile !== "function") {
    throw new Error("compileBundle requires options.readFile(path)");
  }
  if (typeof resolveModule !== "function") {
    throw new Error("compileBundle requires options.resolveModule(specifier, importerPath)");
  }
  const runtimePath = options.runtimePath || "./runtime";
  const shouldBundleImport = typeof options.shouldBundleImport === "function" ? options.shouldBundleImport : (specifier) => specifier.startsWith(".");
  const order = [];
  const seen = new Set;
  const active = new Set;
  const modules = new Map;
  function visit(modulePath) {
    if (seen.has(modulePath))
      return;
    if (active.has(modulePath)) {
      throw new Error(`Circular local import while bundling: ${modulePath}`);
    }
    active.add(modulePath);
    const source = String(readFile(modulePath) || "");
    const normalized = source.replace(/\r\n/g, `
`);
    const ast = Parser.getAST(normalized, "parse");
    const statements = splitStatements(ast);
    const deps = collectImportSources(statements).filter((specifier) => shouldBundleImport(specifier, modulePath)).map((specifier) => resolveModule(specifier, modulePath));
    deps.forEach(visit);
    active.delete(modulePath);
    seen.add(modulePath);
    const compiled = compile(normalized, {
      runtimePath,
      module: true,
      autoPrintExpressions: options.autoPrintExpressions
    });
    modules.set(modulePath, splitImportsAndBody(compiled));
    order.push(modulePath);
  }
  visit(entryPath);
  const importSet = new Set;
  const body = ["// Generated by 10x compiler bundle (experimental resolver backend)"];
  order.forEach((modulePath) => {
    const chunk = modules.get(modulePath);
    if (!chunk)
      return;
    chunk.imports.forEach((line) => importSet.add(line));
  });
  if (importSet.size) {
    body.push(...Array.from(importSet));
    body.push("");
  }
  order.forEach((modulePath) => {
    const chunk = modules.get(modulePath);
    if (!chunk)
      return;
    body.push(`// Module: ${modulePath}`);
    body.push(...chunk.body);
    body.push("");
  });
  while (body.length && !body[body.length - 1].trim())
    body.pop();
  return body.join(`
`);
}
// src/runtime/index.js
var exports_runtime = {};
__export(exports_runtime, {
  untracked: () => untracked,
  style: () => style,
  signal: () => signal,
  setDevtoolsActive: () => setDevtoolsActive,
  renderShadow: () => renderShadow,
  render: () => render2,
  read: () => read,
  prop: () => prop,
  on: () => on,
  maybeEnableDevtools: () => maybeEnableDevtools,
  isSignal: () => isSignal,
  isDevtoolsActive: () => isDevtoolsActive,
  html: () => html,
  h: () => me,
  getSignalRegistry: () => getSignalRegistry,
  effect: () => effect,
  devtoolsEnabledByQuery: () => devtoolsEnabledByQuery,
  devtools: () => devtools,
  computed: () => computed,
  batch: () => batch,
  SignalProxy: () => SignalProxy
});

// src/runtime/core.js
var SIGNAL = Symbol("10x.signal");
var MAX_HISTORY = 20;

class SignalProxy {
  constructor(signal) {
    this._signal = signal;
  }
  valueOf() {
    return this._signal.peek();
  }
  toString() {
    return String(this._signal.peek());
  }
  get() {
    return this._signal.peek();
  }
  set(v2) {
    return this._signal.set(v2);
  }
  get value() {
    return this._signal.peek();
  }
  peek() {
    return this._signal.peek();
  }
  subscribe(cb) {
    return this._signal.subscribe(cb);
  }
}
var currentEffect = null;
var devtoolsActive = false;
function setDevtoolsActive(active) {
  devtoolsActive = active;
}
function isDevtoolsActive() {
  return devtoolsActive;
}
var globalRegistry = (() => {
  if (!globalThis.__10x_signals) {
    globalThis.__10x_signals = new Map;
  }
  return globalThis.__10x_signals;
})();
function nextSignalId() {
  const current2 = Number(globalThis.__10x_signal_id_counter || 0) + 1;
  globalThis.__10x_signal_id_counter = current2;
  return current2;
}
function signal(initialValue, name) {
  const key = name || Symbol("signal");
  const signalName = String(key);
  const signalId = nextSignalId();
  const state = {
    [SIGNAL]: true,
    _devtoolsId: signalId,
    _devtoolsName: signalName,
    _value: initialValue,
    _history: [],
    _moduleUrl: undefined,
    subs: new Set,
    get value() {
      return this.get();
    },
    set value(nextValue) {
      this.set(nextValue);
    },
    get() {
      if (currentEffect) {
        this.subs.add(currentEffect);
        if (currentEffect._deps)
          currentEffect._deps.add(this);
      }
      return this._value;
    },
    set(nextValue) {
      const prev = this._value;
      this._value = nextValue;
      if (devtoolsActive && this._history) {
        this._history.push({ value: nextValue, prev, ts: Date.now() });
        if (this._history.length > MAX_HISTORY)
          this._history.shift();
      }
      const notify = globalThis.__10x_devtools_notify;
      if (typeof notify === "function") {
        try {
          notify({
            id: this._devtoolsId,
            name: this._devtoolsName,
            moduleUrl: this._moduleUrl || "global",
            value: nextValue,
            subs: this.subs ? this.subs.size : 0,
            history: Array.isArray(this._history) ? this._history.slice(-MAX_HISTORY) : [],
            ts: Date.now()
          });
          if (globalThis.__10x_devtools_debug) {
            console.debug("[10x:core] notified devtools", {
              id: this._devtoolsId,
              name: this._devtoolsName,
              value: nextValue
            });
          }
        } catch (_2) {}
      }
      Array.from(this.subs).forEach((fn) => fn());
      return this._value;
    },
    peek() {
      return this._value;
    },
    subscribe(cb) {
      this.subs.add(cb);
      return () => this.subs.delete(cb);
    }
  };
  globalRegistry.set(key, state);
  return state;
}
function isSignal(value) {
  return !!(value && value[SIGNAL]);
}
function read(value) {
  return isSignal(value) ? value.get() : value;
}
function effect(fn) {
  const cleanup = () => {
    if (!run._deps)
      return;
    run._deps.forEach((dep) => {
      if (dep && dep.subs)
        dep.subs.delete(run);
    });
    run._deps.clear();
  };
  const run = () => {
    if (run._stopped)
      return;
    cleanup();
    currentEffect = run;
    let result;
    try {
      result = fn();
    } catch (error) {
      currentEffect = null;
      throw error;
    }
    if (result && typeof result.then === "function") {
      return result.finally(() => {
        if (currentEffect === run)
          currentEffect = null;
      });
    }
    currentEffect = null;
    return result;
  };
  run._deps = new Set;
  run._stopped = false;
  run.stop = () => {
    run._stopped = true;
    cleanup();
  };
  run();
  return run;
}
function computed(fn) {
  const out = signal(undefined);
  effect(() => out.set(fn()));
  return out;
}
function batch(fn) {
  return fn();
}
function untracked(fn) {
  const prev = currentEffect;
  currentEffect = null;
  try {
    return fn();
  } finally {
    currentEffect = prev;
  }
}
function html(renderFn) {
  if (typeof renderFn !== "function") {
    throw new Error("html(...) expects a function");
  }
  return {
    render: renderFn
  };
}
function prop(host, name, fallback) {
  const raw = host.getAttribute(name);
  return raw !== null ? Number(raw) || raw : fallback;
}
function getSignalRegistry() {
  return globalRegistry;
}
// src/runtime/dom.js
var componentObservers = new WeakMap;
function registerShadowHost(host, moduleUrl) {
  if (!moduleUrl)
    return;
  const globalObj = globalThis;
  const registry = globalObj.__10x_components instanceof Map ? globalObj.__10x_components : globalObj.__10x_components = new Map;
  let hosts = registry.get(moduleUrl);
  if (!hosts) {
    hosts = new Set;
    registry.set(moduleUrl, hosts);
  }
  hosts.add(host);
  if (typeof MutationObserver !== "function")
    return;
  if (typeof document === "undefined" || !document.body)
    return;
  let byModule = componentObservers.get(host);
  if (!byModule) {
    byModule = new Map;
    componentObservers.set(host, byModule);
  }
  if (byModule.has(moduleUrl))
    return;
  const cleanup = () => {
    const currentHosts = registry.get(moduleUrl);
    if (currentHosts) {
      currentHosts.delete(host);
      if (!currentHosts.size)
        registry.delete(moduleUrl);
    }
    const currentByModule = componentObservers.get(host);
    if (currentByModule) {
      const observer2 = currentByModule.get(moduleUrl);
      if (observer2)
        observer2.disconnect();
      currentByModule.delete(moduleUrl);
      if (!currentByModule.size)
        componentObservers.delete(host);
    }
  };
  const observer = new MutationObserver(() => {
    if (!host.isConnected)
      cleanup();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  byModule.set(moduleUrl, observer);
}
function hashStr(str) {
  let hash = 0;
  for (let i2 = 0;i2 < str.length; i2++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i2) | 0;
  }
  return Math.abs(hash).toString(36);
}
function dashCase(input) {
  return String(input || "").replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}
function objectToCss(value, selector = ":host") {
  if (!value || typeof value !== "object")
    return "";
  const declarations = [];
  const nested = [];
  Object.entries(value).forEach(([key, entry]) => {
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      const nestedSelector = selector === ":host" ? key : `${selector} ${key}`;
      const nestedCss = objectToCss(entry, nestedSelector);
      if (nestedCss)
        nested.push(nestedCss);
      return;
    }
    declarations.push(`  ${dashCase(key)}: ${entry};`);
  });
  const block = declarations.length ? `${selector} {
${declarations.join(`
`)}
}` : "";
  return [block].concat(nested).filter(Boolean).join(`
`);
}
function style(hostOrCss, css) {
  if (typeof document === "undefined")
    return;
  const hasHost = css !== undefined;
  const host = hasHost ? hostOrCss : null;
  const raw = hasHost ? css : hostOrCss;
  const cssText = typeof raw === "string" ? raw : objectToCss(raw);
  if (!cssText || !cssText.trim())
    return;
  if (hasHost) {
    const shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
    const element2 = document.createElement("style");
    element2.textContent = cssText;
    shadow.insertBefore(element2, shadow.firstChild);
    return;
  }
  const id = `10x-${hashStr(cssText)}`;
  if (document.getElementById(id))
    return;
  const element = document.createElement("style");
  element.id = id;
  element.textContent = cssText;
  document.head.appendChild(element);
}
function render2(selectorOrElement, view) {
  if (typeof document === "undefined") {
    return () => {};
  }
  if (!view || typeof view.render !== "function") {
    throw new Error("render(...) expects a view from html(...)");
  }
  const target = typeof selectorOrElement === "string" ? document.querySelector(selectorOrElement) : selectorOrElement;
  if (!target)
    throw new Error(`Render target not found: ${selectorOrElement}`);
  let prev = null;
  let root = null;
  const rootFor = (next) => y(next) ? target.firstChild : target;
  const remount = (next) => {
    target.innerHTML = "";
    untracked(() => he(target, next));
    root = rootFor(next);
    prev = next;
  };
  return effect(async () => {
    const next = await view.render();
    if (typeof next === "string") {
      target.innerHTML = next;
      prev = null;
      root = null;
    } else if (!prev) {
      untracked(() => he(target, next));
      root = rootFor(next);
      prev = next;
    } else if (root) {
      try {
        const node = await Promise.resolve().then(() => untracked(() => ge(root, prev, next)));
        root = node || root;
        prev = next;
      } catch (_2) {
        remount(next);
      }
    } else {
      remount(next);
    }
  });
}
function on(eventName, selectorOrElement, handler, root) {
  if (typeof document === "undefined") {
    return () => {};
  }
  if (typeof handler !== "function")
    throw new Error("on(...) expects a handler function");
  if (typeof selectorOrElement === "string") {
    const eventRoot = root ?? document;
    const delegated = (event) => {
      const origin = event && event.target;
      const matched = origin && typeof origin.closest === "function" ? origin.closest(selectorOrElement) : null;
      if (matched)
        handler(event);
    };
    eventRoot.addEventListener(eventName, delegated);
    return () => eventRoot.removeEventListener(eventName, delegated);
  }
  const target = selectorOrElement;
  if (!target)
    throw new Error(`Event target not found: ${selectorOrElement}`);
  target.addEventListener(eventName, handler);
  return () => target.removeEventListener(eventName, handler);
}
function renderShadow(host, view, moduleUrl) {
  if (typeof document === "undefined") {
    return () => {};
  }
  if (!view || typeof view.render !== "function") {
    throw new Error("renderShadow(...) expects a view from html(...)");
  }
  const shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
  registerShadowHost(host, moduleUrl);
  const outlet = document.createElement("div");
  shadow.appendChild(outlet);
  let prev = null;
  let root = null;
  const rootFor = (next) => y(next) ? outlet.firstChild : outlet;
  const remount = (next) => {
    outlet.innerHTML = "";
    untracked(() => he(outlet, next));
    root = rootFor(next);
    prev = next;
  };
  return effect(async () => {
    const next = await view.render();
    if (typeof next === "string") {
      outlet.innerHTML = next;
      prev = null;
      root = null;
    } else if (!prev) {
      untracked(() => he(outlet, next));
      root = rootFor(next);
      prev = next;
    } else if (root) {
      try {
        const node = await Promise.resolve().then(() => untracked(() => ge(root, prev, next)));
        root = node || root;
        prev = next;
      } catch (_2) {
        remount(next);
      }
    } else {
      remount(next);
    }
  });
}
// src/runtime/devtools.js
var MAX_HISTORY2 = 20;
function getValueColor(value) {
  if (value === null || value === undefined)
    return "#888";
  if (typeof value === "number")
    return "#79c0ff";
  if (typeof value === "string")
    return "#7ee787";
  if (Array.isArray(value))
    return "#ffa657";
  if (typeof value === "object")
    return "#ffa657";
  return "#d8dde4";
}
function formatValue(value, container) {
  const str = JSON.stringify(value);
  container.textContent = str;
  container.style.color = getValueColor(value);
}
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {});
}
function renderGroupedRows(container, groups, collapsedSignals, rerender) {
  container.innerHTML = "";
  groups.forEach((signals, moduleUrl) => {
    const groupHeader = document.createElement("div");
    groupHeader.style.cssText = "font-weight:600;margin:0.75rem 0 0.25rem;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px;";
    groupHeader.textContent = moduleUrl === "global" ? "Global" : moduleUrl.split("/").pop() || moduleUrl;
    container.appendChild(groupHeader);
    signals.forEach(({ name, value, subsCount, history }) => {
      const isCollapsed = collapsedSignals.has(name);
      const row = document.createElement("div");
      row.style.cssText = "margin-bottom:0.25rem;";
      const header = document.createElement("div");
      header.style.cssText = "display:grid;grid-template-columns:1fr auto auto;gap:0.6rem;padding:0.25rem 0;cursor:pointer;";
      header.onclick = () => {
        if (collapsedSignals.has(name)) {
          collapsedSignals.delete(name);
        } else {
          collapsedSignals.add(name);
        }
        rerender();
      };
      const key = document.createElement("code");
      key.textContent = String(name);
      key.style.color = "#d2a8ff";
      const valueEl = document.createElement("code");
      formatValue(value, valueEl);
      valueEl.style.cursor = "pointer";
      valueEl.title = "Click to copy";
      valueEl.onclick = (e2) => {
        e2.stopPropagation();
        copyToClipboard(JSON.stringify(value));
      };
      const subs = document.createElement("code");
      subs.textContent = `subs:${subsCount}`;
      subs.style.color = "#8b949e";
      header.appendChild(key);
      header.appendChild(valueEl);
      header.appendChild(subs);
      row.appendChild(header);
      if (!isCollapsed && history.length > 0) {
        const historyDiv = document.createElement("div");
        historyDiv.style.cssText = "font-size:10px;margin-left:1rem;padding:0.25rem;background:rgba(255,255,255,0.03);border-radius:4px;max-height:120px;overflow:auto;";
        const historyHeader = document.createElement("div");
        historyHeader.style.cssText = "color:#888;margin-bottom:0.25rem;";
        historyHeader.textContent = `History (${history.length})`;
        historyDiv.appendChild(historyHeader);
        [...history].reverse().forEach((h2, i2) => {
          const entry = document.createElement("div");
          entry.style.cssText = "display:flex;justify-content:space-between;gap:0.5rem;margin:0.15rem 0;";
          const ts = document.createElement("span");
          const date = new Date(h2.ts);
          ts.textContent = date.toLocaleTimeString();
          ts.style.color = "#666";
          const val = document.createElement("span");
          formatValue(h2.value, val);
          val.style.fontWeight = i2 === 0 ? "600" : "400";
          entry.appendChild(ts);
          entry.appendChild(val);
          historyDiv.appendChild(entry);
        });
        row.appendChild(historyDiv);
      }
      container.appendChild(row);
    });
  });
}
function renderRows(container, registry, collapsedSignals) {
  const entries = Array.from(registry.entries());
  const moduleGroups = new Map;
  entries.forEach(([name, signal2]) => {
    const moduleUrl = signal2._moduleUrl || "global";
    if (!moduleGroups.has(moduleUrl)) {
      moduleGroups.set(moduleUrl, []);
    }
    moduleGroups.get(moduleUrl).push({
      id: signal2._devtoolsId || null,
      name,
      value: read(signal2),
      subsCount: signal2.subs ? signal2.subs.size : 0,
      history: signal2._history || []
    });
  });
  renderGroupedRows(container, moduleGroups, collapsedSignals, () => renderRows(container, registry, collapsedSignals));
}
function renderRowsFromSnapshot(container, snapshot, collapsedSignals) {
  const moduleGroups = new Map;
  (Array.isArray(snapshot) ? snapshot : []).forEach((entry) => {
    if (!entry || !entry.name)
      return;
    const moduleUrl = entry.moduleUrl || "global";
    if (!moduleGroups.has(moduleUrl)) {
      moduleGroups.set(moduleUrl, []);
    }
    moduleGroups.get(moduleUrl).push({
      id: entry.id || null,
      name: entry.name,
      value: entry.value,
      subsCount: Number.isFinite(entry.subs) ? entry.subs : 0,
      history: Array.isArray(entry.history) ? entry.history.slice(-MAX_HISTORY2) : []
    });
  });
  renderGroupedRows(container, moduleGroups, collapsedSignals, () => renderRowsFromSnapshot(container, snapshot, collapsedSignals));
}
function mergeSignalUpdate(snapshot, update) {
  if (!update || typeof update.name !== "string")
    return snapshot;
  const current2 = Array.isArray(snapshot) ? snapshot : [];
  const next = current2.map((entry) => ({ ...entry }));
  const index = next.findIndex((entry) => entry && (update.id != null && entry.id === update.id || entry.name === update.name));
  const history = Array.isArray(update.history) ? update.history.slice(-MAX_HISTORY2) : [{ ts: update.ts || Date.now(), value: update.value }];
  const merged = {
    id: update.id || null,
    name: update.name,
    moduleUrl: update.moduleUrl || "global",
    value: update.value,
    subs: Number.isFinite(update.subs) ? update.subs : 0,
    history
  };
  if (index >= 0) {
    next[index] = merged;
  } else {
    next.push(merged);
  }
  return next;
}
function devtools(options = {}) {
  if (typeof document === "undefined")
    return null;
  const { docked = false, container = null } = options;
  const dockedPane = docked && container ? container.closest(".devtools-pane") || container : null;
  const dockedLayout = dockedPane ? dockedPane.closest(".layout") : null;
  let panel = document.getElementById("10x-devtools-panel");
  if (panel)
    return panel;
  const registry = getSignalRegistry();
  const collapsedSignals = new Set;
  let latestSnapshot = [];
  let hmrMessage = null;
  let hmrTimeout = null;
  panel = document.createElement("aside");
  panel.id = "10x-devtools-panel";
  panel.style.cssText = docked ? "width:100%;height:100%;overflow:auto;padding:0.5rem;" : "position:fixed;bottom:1rem;right:1rem;width:360px;max-height:45vh;overflow:auto;z-index:99999;padding:0.7rem;border-radius:12px;border:1px solid rgba(255,255,255,0.15);background:rgba(12,16,22,0.94);color:#d8dde4;font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;";
  if (!docked) {
    panel.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
  }
  const title = document.createElement("div");
  title.style.cssText = "font-weight:700;margin-bottom:0.5rem;display:flex;justify-content:space-between;align-items:center;";
  title.innerHTML = `<span>10x DevTools</span><span style="font-weight:400;font-size:10px;color:#888;">Alt+D / Ctrl+Shift+D</span>`;
  const hmrStatus = document.createElement("div");
  hmrStatus.id = "10x-hmr-status";
  hmrStatus.style.cssText = "font-size:11px;margin-bottom:0.5rem;padding:0.25rem 0.5rem;background:#238636;border-radius:4px;color:#fff;display:none;";
  const body = document.createElement("div");
  panel.appendChild(title);
  panel.appendChild(hmrStatus);
  panel.appendChild(body);
  if (docked && container) {
    container.appendChild(panel);
  } else {
    document.body.appendChild(panel);
  }
  setDevtoolsActive(true);
  effect(() => {
    renderRows(body, registry, collapsedSignals);
  });
  function toggle() {
    const target = dockedPane || panel;
    const hidden = target.style.display === "none";
    if (hidden) {
      target.style.display = "";
      if (dockedLayout && dockedPane) {
        dockedLayout.style.gridTemplateColumns = "";
      }
    } else {
      target.style.display = "none";
      if (dockedLayout && dockedPane) {
        dockedLayout.style.gridTemplateColumns = "1fr";
      }
    }
  }
  function showHmrMessage(count, url) {
    hmrMessage = { count, url, ts: Date.now() };
    hmrStatus.textContent = `HMR — ${count} signals restored`;
    hmrStatus.style.display = "block";
    clearTimeout(hmrTimeout);
    hmrTimeout = setTimeout(() => {
      hmrStatus.style.display = "none";
      hmrMessage = null;
    }, 3000);
  }
  globalThis.__10x_devtools = {
    active: true,
    onHmr: ({ restored = 0, url = "" }) => showHmrMessage(restored, url),
    onSignals: (snapshot) => {
      latestSnapshot = Array.isArray(snapshot) ? snapshot : [];
      if (globalThis.__10x_devtools_debug) {
        console.debug("[10x:devtools] onSignals snapshot", { count: latestSnapshot.length });
      }
      renderRowsFromSnapshot(body, latestSnapshot, collapsedSignals);
    },
    toggle
  };
  globalThis.__10x_devtools_notify = (update) => {
    if (globalThis.__10x_devtools_debug) {
      console.debug("[10x:devtools] notify update", update);
    }
    latestSnapshot = mergeSignalUpdate(latestSnapshot, update);
    renderRowsFromSnapshot(body, latestSnapshot, collapsedSignals);
  };
  document.addEventListener("keydown", (e2) => {
    const isAltD = e2.altKey && (e2.key === "d" || e2.key === "D");
    const isCtrlShiftD = e2.ctrlKey && e2.shiftKey && (e2.key === "d" || e2.key === "D");
    if (isAltD || isCtrlShiftD) {
      e2.preventDefault();
      toggle();
    }
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
function maybeEnableDevtools(options = {}) {
  if (typeof document === "undefined" || typeof window === "undefined")
    return null;
  if (!devtoolsEnabledByQuery(window.location && window.location.search) && !options.force)
    return null;
  const start = () => {
    try {
      devtools(options);
    } catch (_2) {}
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
function style2(open, close) {
  return (value) => `\x1B[${open}m${value}\x1B[${close}m`;
}
var ansi = {};
var names = Object.keys(CODES);
names.forEach((name) => {
  const [open, close] = CODES[name];
  ansi[name] = style2(open, close);
});
names.forEach((first) => {
  names.forEach((second) => {
    ansi[first][second] = (value) => ansi[first](ansi[second](value));
  });
});
var ansi_default = ansi;

// src/util.js
function print(...args) {
  process.stdout.write(args.join(""));
}
function markers(color, value) {
  return value.replace(/(?<![{#])\{(.+?)\}/g, (_2, v2) => color.gray(`{${v2}}`));
}
function colorize(type, value, dimmed) {
  const color = dimmed ? ansi_default.dim : ansi_default;
  value = value || literal({ type });
  if (type === EOF)
    return "";
  switch (type) {
    case true:
    case COMMENT:
    case COMMENT_MULTI:
    case CLOSE:
    case OPEN:
    case BEGIN:
    case DONE:
      return color.gray(value);
    case null:
    case EOL:
    case COMMA:
    case RANGE:
    case DOT:
      return color.white(value);
    case CODE:
      return color.cyanBright(value);
    case BOLD:
      return color.redBright.bold(value);
    case ITALIC:
      return color.yellowBright.italic(value);
    case REF:
      value = ansi_default.underline(value);
    case TEXT:
      return color.white(value);
    case LESS:
    case LESS_EQ:
    case GREATER:
    case GREATER_EQ:
    case EXACT_EQ:
    case NOT_EQ:
    case EQUAL:
    case MINUS:
    case PLUS:
    case MUL:
    case DIV:
    case MOD:
    case NOT:
    case SOME:
    case EVERY:
    case MOD:
    case PIPE:
    case BLOCK:
    case MINUS:
    case PLUS:
    case LIKE:
    case OR:
    case OL_ITEM:
    case UL_ITEM:
    case HEADING:
    case BLOCKQUOTE:
      return color.magenta(value);
    case SYMBOL:
      return color.yellow(value);
    case DIRECTIVE:
      return color.magenta(value);
    case STRING:
      value = markers(color, value);
    case REGEX:
      return color.blueBright(value);
    case LITERAL:
      if (value === null)
        return color.yellow(":nil");
      if (value === true)
        return color.yellow(":on");
      if (value === false)
        return color.yellow(":off");
      return color.white(value);
    case NUMBER:
      return color.blue(value);
    default:
      return color.bgRedBright(value);
  }
}
function summary(e2, code, noInfo) {
  return debug(e2, code, noInfo, (source) => {
    try {
      return Parser.getAST(source, "split").map((chunk) => {
        const highlighted = !chunk.lines.includes(e2.line);
        return chunk.body.map((x2) => {
          return serialize(x2, null, (k2, v2) => colorize(k2, v2, highlighted));
        }).join("");
      }).join("");
    } catch (e3) {
      return ansi_default.red(source);
    }
  }, colorize).trim();
}
function inspect(calls) {
  calls.forEach(([type, depth, tokens], key, items2) => {
    const nextItem = items2[key + 1];
    let prefix = "";
    let pivot = "";
    if (!nextItem || nextItem[1] !== depth) {
      pivot = key ? "└─" : "├──";
    } else {
      pivot = "├─";
    }
    if (depth > 1) {
      prefix += `│${Array.from({ length: depth }).join("  ")}${pivot} `;
    } else {
      prefix += `${pivot} `;
    }
    const value = serialize(tokens, true, colorize, type);
    const indent = `             ${type} `.substr(-15);
    print(indent, prefix, value, `
`);
  });
}
async function format3(code, color, inline) {
  print(serialize.call({}, Parser.getAST(code, inline ? "inline" : "raw"), null, color ? colorize : undefined), `
`);
}
async function main(code, raw, env, info, noInfo, prelude) {
  try {
    if (!raw && typeof prelude === "function") {
      code = await prelude(env, code) || code;
    }
    const result = raw ? Parser.getAST(code, "inline", env) : await execute(code, env, info);
    if (execute.failure) {
      throw execute.failure;
    }
    print("\r");
    if (info) {
      const { length } = execute.info.calls;
      if (length < 100) {
        inspect(execute.info.calls);
      } else {
        inspect([execute.info.calls[0]]);
      }
      print(`               ├ ${colorize(true, `${length} step${length === 1 ? "" : "s"}`)} 
`);
      print("               └ ", serialize(result, null, colorize), `
`);
    } else if (result) {
      print(serialize(result, null, colorize), `
`);
    }
  } catch (e2) {
    print(summary(e2, code, noInfo), `
`);
  }
}
// src/main.js
function applyAdapter2(adapter, options) {
  applyAdapter({
    Env,
    Expr,
    execute,
    evaluate
  }, adapter, options);
}
function createEnv2(adapter, options) {
  return createEnv({
    Env,
    Expr,
    execute,
    evaluate
  }, adapter, options);
}
export {
  useCurrencies,
  serialize,
  repr,
  raise,
  only,
  main,
  hasDiff,
  format3 as format,
  execute,
  evaluate,
  deindent,
  debug,
  createEnv2 as createEnv,
  copy,
  compileBundle,
  compile,
  compact,
  check,
  assert,
  argv,
  applyAdapter2 as applyAdapter,
  UL_ITEM,
  Token,
  TEXT,
  TABLE,
  SYMBOL_TYPES,
  SYMBOL,
  STRING,
  SPREAD,
  SOME,
  exports_runtime as Runtime,
  REGEX,
  REF,
  RANGE,
  Parser,
  PLUS,
  PIPE,
  OR,
  OPEN,
  OL_ITEM,
  NUMBER,
  NOT_EQ,
  NOT,
  MUL,
  MOD,
  MINUS,
  LITERAL,
  LIKE,
  LESS_EQ,
  LESS,
  ITALIC,
  HEADING,
  GREATER_EQ,
  GREATER,
  FFI,
  Expr,
  Env,
  EXACT_EQ,
  EVERY,
  EQUAL,
  EOL,
  EOF,
  DOT,
  DONE,
  DIV,
  DIRECTIVE,
  DERIVE_METHODS,
  CONTROL_TYPES,
  COMMENT_MULTI,
  COMMENT,
  COMMA,
  CODE,
  CLOSE,
  BOLD,
  BLOCKQUOTE,
  BLOCK,
  BEGIN
};
