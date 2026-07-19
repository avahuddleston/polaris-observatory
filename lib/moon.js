import * as SunCalc from "suncalc";

// Returns { fraction, phaseValue, name, emoji } for a given date.
export function getMoonPhase(date) {
  const { fraction, phase } = SunCalc.getMoonIllumination(date);

  let name = "New Moon";
  let emoji = "\u{1F311}"; // 🌑

  if (phase < 0.03 || phase > 0.97) {
    name = "New Moon";
    emoji = "\u{1F311}";
  } else if (phase < 0.22) {
    name = "Waxing Crescent";
    emoji = "\u{1F312}";
  } else if (phase < 0.28) {
    name = "First Quarter";
    emoji = "\u{1F313}";
  } else if (phase < 0.47) {
    name = "Waxing Gibbous";
    emoji = "\u{1F314}";
  } else if (phase < 0.53) {
    name = "Full Moon";
    emoji = "\u{1F315}";
  } else if (phase < 0.72) {
    name = "Waning Gibbous";
    emoji = "\u{1F316}";
  } else if (phase < 0.78) {
    name = "Last Quarter";
    emoji = "\u{1F317}";
  } else {
    name = "Waning Crescent";
    emoji = "\u{1F318}";
  }

  return {
    fraction: Math.round(fraction * 100),
    phaseValue: phase,
    name,
    emoji,
  };
}

// Good observing nights are darker skies -> lower illumination fraction.
export function isGoodObservingNight(date) {
  const { fraction } = getMoonPhase(date);
  return fraction <= 35;
}
