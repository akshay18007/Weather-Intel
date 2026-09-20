import { CurrentWeather, DailyForecastItem, HourlyForecastItem, PlanningRecommendation, TemperatureUnit } from '../types/weather';

export function generatePlanningRecommendations(
  current: CurrentWeather,
  hourly: HourlyForecastItem[],
  daily: DailyForecastItem[],
  unit: TemperatureUnit
): PlanningRecommendation {
  // Normalize apparent temperature to Celsius for evaluation logic
  const apparentTempC = unit === 'fahrenheit' 
    ? (current.apparentTemperature - 32) * (5 / 9)
    : current.apparentTemperature;
  
  const tempC = unit === 'fahrenheit' 
    ? (current.temperature - 32) * (5 / 9)
    : current.temperature;

  const code = current.weatherCode;
  const precip = current.precipitation;
  const windKmh = current.windSpeed;
  const gustsKmh = current.windGusts;
  const uv = current.uvIndex;
  const humidity = current.relativeHumidity;

  // 1. Calculate Activity Score (0 - 100)
  let score = 100;

  // Penalize for precipitation & severe weather
  if ([95, 96, 99].includes(code)) {
    score -= 75; // Thunderstorm
  } else if ([65, 82, 75, 77].includes(code)) {
    score -= 60; // Heavy rain / snow
  } else if ([63, 73, 81, 86].includes(code)) {
    score -= 40; // Moderate rain / snow
  } else if ([51, 53, 55, 61, 80].includes(code) || precip > 0.5) {
    score -= 25; // Drizzle / light rain
  }

  // Wind penalty
  if (gustsKmh > 55 || windKmh > 40) {
    score -= 30;
  } else if (gustsKmh > 35 || windKmh > 25) {
    score -= 15;
  }

  // Temperature discomfort penalty
  if (tempC < -5) {
    score -= 45;
  } else if (tempC < 5) {
    score -= 20;
  } else if (tempC > 34) {
    score -= 40;
  } else if (tempC > 29) {
    score -= 20;
  }

  // UV penalty for intense midday sun
  if (uv >= 8) {
    score -= 15;
  }

  score = Math.max(10, Math.min(98, score));

  let activityRating: PlanningRecommendation['activityRating'] = 'Good';
  let overallTone: PlanningRecommendation['overallTone'] = 'favorable';

  if (score >= 85) {
    activityRating = 'Excellent';
    overallTone = 'ideal';
  } else if (score >= 70) {
    activityRating = 'Good';
    overallTone = 'favorable';
  } else if (score >= 50) {
    activityRating = 'Fair';
    overallTone = 'moderate';
  } else if (score >= 30) {
    activityRating = 'Caution';
    overallTone = 'unfavorable';
  } else {
    activityRating = 'Stay Indoors';
    overallTone = 'unfavorable';
  }

  // 2. Best Outdoor Time Window (Inspect next 14 daylight hours)
  let bestOutdoorWindow = 'Midday to late afternoon (11:00 AM – 3:00 PM)';
  const daytimeHours = hourly.filter(h => h.isDay).slice(0, 16);

  if (daytimeHours.length > 0) {
    // Find consecutive low-precip, comfortable temp hours
    const sorted = [...daytimeHours].sort((a, b) => {
      const aScore = a.precipitationProbability * 2 + Math.abs(a.temperature - (unit === 'fahrenheit' ? 68 : 20));
      const bScore = b.precipitationProbability * 2 + Math.abs(b.temperature - (unit === 'fahrenheit' ? 68 : 20));
      return aScore - bScore;
    });

    if (sorted.length > 0) {
      const bestHour = sorted[0];
      const hourNum = parseInt(bestHour.formattedTime, 10) || 10;
      const endHour = (hourNum + 2) % 24;
      const ampm1 = hourNum >= 12 ? 'PM' : 'AM';
      const ampm2 = endHour >= 12 ? 'PM' : 'AM';
      const displayHour1 = hourNum % 12 === 0 ? 12 : hourNum % 12;
      const displayHour2 = endHour % 12 === 0 ? 12 : endHour % 12;
      bestOutdoorWindow = `${displayHour1}:00 ${ampm1} – ${displayHour2}:00 ${ampm2} (Lowest rain risk & mildest temp)`;
    }
  }

  // 3. Outfit Advice
  let outfit = {
    top: 'Breathable cotton tee or shirt',
    bottom: 'Chinos or light denim trousers',
    outerwear: 'Light windbreaker or cardigan for evening',
    footwear: 'Comfortable everyday sneakers',
    summary: 'Mild, balanced conditions suitable for single layers with an optional light outer layer.',
  };

  if (apparentTempC < 0) {
    outfit = {
      top: 'Thermal base layer under a heavy wool sweater',
      bottom: 'Insulated trousers or fleece-lined pants',
      outerwear: 'Heavy down parka, insulated winter coat, warm beanie & gloves',
      footwear: 'Insulated, waterproof winter boots with traction',
      summary: 'Sub-freezing temperatures require complete multi-layered thermal insulation.',
    };
  } else if (apparentTempC < 10) {
    outfit = {
      top: 'Long-sleeve thermal tee or warm fleece sweater',
      bottom: 'Heavy denim jeans or structured trousers',
      outerwear: 'Mid-weight wool trench coat or insulated jacket',
      footwear: 'Sturdy leather boots or warm sneakers with wool socks',
      summary: 'Brisk conditions call for a warm jacket and structured layers.',
    };
  } else if (apparentTempC < 18) {
    outfit = {
      top: 'Long-sleeve shirt or soft crewneck sweater',
      bottom: 'Comfortable denim jeans or cotton chinos',
      outerwear: 'Light utility jacket, denim jacket, or zip hoodie',
      footwear: 'Classic sneakers or supportive walking shoes',
      summary: 'Crisp, pleasant weather; a light versatile jacket handles daytime variations.',
    };
  } else if (apparentTempC < 26) {
    outfit = {
      top: 'Lightweight cotton or linen t-shirt / button-up',
      bottom: 'Breathable chinos, linen trousers, or relaxed jeans',
      outerwear: 'None needed during the day; pack a light cardigan if out late',
      footwear: 'Breathable low-top sneakers or loafers',
      summary: 'Pleasantly warm and comfortable for light, casual single-layer wear.',
    };
  } else {
    outfit = {
      top: 'Ultra-light, loose-fitting linen shirt or moisture-wicking tee',
      bottom: 'Light shorts, linen skirt, or loose trousers',
      outerwear: 'UV sun-protective shirt or wide-brim sunhat',
      footwear: 'Ventilated athletic mesh shoes or comfortable sandals',
      summary: 'High temperatures demand lightweight, breathable fabrics and sun shielding.',
    };
  }

  // Adjust outerwear for rain/storm
  if ([61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code) || precip > 1.0) {
    outfit.outerwear = 'Waterproof hooded rain jacket / trench';
    outfit.footwear = 'Water-resistant shoes or rain boots';
  } else if (windKmh > 30) {
    outfit.outerwear = 'Wind-resistant shell or windbreaker with snug cuffs';
  }

  // 4. Essentials Checklist
  const essentialsChecklist: PlanningRecommendation['essentialsChecklist'] = [];

  // Umbrella
  const rainLikely = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(code) || precip > 0.5;
  const maxRainProb = daily[0]?.precipitationProbabilityMax ?? 0;
  if (rainLikely || maxRainProb > 50) {
    essentialsChecklist.push({
      id: 'umbrella',
      item: 'Compact Umbrella or Rain Shell',
      status: 'required',
      note: `${maxRainProb > 0 ? `${maxRainProb}% chance of precipitation` : 'Active rainfall'}. Pack reliable rain protection.`,
      icon: 'Umbrella',
    });
  } else if (maxRainProb > 25) {
    essentialsChecklist.push({
      id: 'umbrella',
      item: 'Foldable Umbrella',
      status: 'recommended',
      note: `${maxRainProb}% chance of passing showers. Worth keeping in your bag as backup.`,
      icon: 'Umbrella',
    });
  } else {
    essentialsChecklist.push({
      id: 'umbrella',
      item: 'Umbrella',
      status: 'not-needed',
      note: 'Dry skies expected today with minimal rain risk.',
      icon: 'Umbrella',
    });
  }

  // Sunglasses & UV Protection
  const maxUv = daily[0]?.uvIndexMax || uv;
  if (maxUv >= 7) {
    essentialsChecklist.push({
      id: 'sun_protection',
      item: 'UV400 Sunglasses & SPF 50+ Sunscreen',
      status: 'required',
      note: `Very high UV index (Peak ${maxUv.toFixed(1)}). Reapply sunscreen every 2 hours and seek shade midday.`,
      icon: 'Sun',
    });
  } else if (maxUv >= 4) {
    essentialsChecklist.push({
      id: 'sun_protection',
      item: 'Sunglasses & Daily Sunscreen',
      status: 'recommended',
      note: `Moderate UV index (Peak ${maxUv.toFixed(1)}). Eye protection and light sunblock advised between 11 AM - 3 PM.`,
      icon: 'Sun',
    });
  } else {
    essentialsChecklist.push({
      id: 'sun_protection',
      item: 'Sunglasses & Sunscreen',
      status: 'optional',
      note: `Low UV index (Peak ${maxUv.toFixed(1)}). Minimal solar radiation risk today.`,
      icon: 'Sun',
    });
  }

  // Windbreaker / Layer
  if (gustsKmh > 35 || windKmh > 25) {
    essentialsChecklist.push({
      id: 'windbreaker',
      item: 'Windbreaker / Outer Shell',
      status: 'recommended',
      note: `Gusty conditions with peaks up to ${Math.round(gustsKmh)} km/h. Protects against wind chill.`,
      icon: 'Wind',
    });
  }

  // Hydration
  if (apparentTempC > 27) {
    essentialsChecklist.push({
      id: 'water',
      item: 'Insulated Water Flask',
      status: 'recommended',
      note: 'Warm conditions increase perspiration. Aim for at least 2.5L of water intake.',
      icon: 'Droplets',
    });
  }

  // 5. Commute Advice
  let commuteWalking = 'Comfortable walking conditions on dry pavements.';
  let commuteCycling = 'Great conditions for cycling with low air resistance.';
  let commuteDriving = 'Clear visibility and standard dry road traction.';
  let roadCondition = 'Dry & Clear';

  if ([95, 96, 99].includes(code)) {
    commuteWalking = 'Avoid walking during lightning and turbulent downpours.';
    commuteCycling = 'Cycling strongly discouraged due to lightning hazard and high winds.';
    commuteDriving = 'Hazardous: Heavy spray, hydroplaning risk, and sudden gusts. Reduce speed.';
    roadCondition = 'Severe Weather / Hydroplaning Hazard';
  } else if ([65, 82, 75].includes(code)) {
    commuteWalking = 'Heavy downpours; wear waterproof shoes and watch for standing puddles.';
    commuteCycling = 'Slick braking distances and spray; bike fenders and waterproof gear essential.';
    commuteDriving = 'Wet highways with reduced visibility; increase following distance.';
    roadCondition = 'Wet & Pooling Puddles';
  } else if ([61, 63, 80, 51, 53].includes(code)) {
    commuteWalking = 'Damp sidewalks; carry an umbrella and step carefully on painted crosswalks.';
    commuteCycling = 'Damp road surface; brake early on metal sewer grates and turns.';
    commuteDriving = 'Wipers required for intermittent showers; minor road mist.';
    roadCondition = 'Damp & Slick';
  } else if ([71, 73, 56, 57, 66, 67].includes(code)) {
    commuteWalking = 'Icy patches or slush possible; wear shoes with winter tread.';
    commuteCycling = 'High risk of skidding on ice or slush; reconsider cycling routes.';
    commuteDriving = 'Black ice and slush accumulation; drive cautiously with smooth braking.';
    roadCondition = 'Snow / Potential Black Ice';
  }

  // 6. Lifestyle (Laundry, Ventilation, Hydration)
  let laundryDrying = 'Great day for outdoor line drying — gentle breeze and low humidity.';
  if (rainLikely || maxRainProb > 40 || humidity > 85) {
    laundryDrying = 'Air dry indoors or use a tumble dryer. High moisture will delay outdoor drying.';
  } else if (humidity > 70) {
    laundryDrying = 'Outdoor drying is possible, but will require 4-5 hours due to ambient humidity.';
  }

  let airQualityOrVentilation = 'Excellent conditions for morning window ventilation (15–20 minutes).';
  if ([45, 48].includes(code)) {
    airQualityOrVentilation = 'Misty/foggy air outside; keep windows closed until fog lifts midday.';
  } else if (windKmh > 35) {
    airQualityOrVentilation = 'High winds outside; crack windows open carefully to avoid slamming doors.';
  } else if (rainLikely) {
    airQualityOrVentilation = 'Keep windows closed or shielded to prevent rain spray entering.';
  }

  let hydrationAlert = apparentTempC > 28
    ? 'High heat warning: Stay ahead of thirst and carry an electrolyte bottle.'
    : 'Standard hydration: Maintain regular water intake throughout the day.';

  // 7. Find Best Upcoming Day in 7-Day Forecast
  let bestDayItem = daily[0];
  let highestDayScore = -999;

  daily.forEach((d) => {
    let dayScore = 100;
    // rain penalty
    dayScore -= (d.precipitationProbabilityMax || 0) * 0.7;
    dayScore -= (d.precipitationSum || 0) * 8;
    // wind penalty
    if (d.windSpeedMax > 30) dayScore -= 15;
    // ideal temp around 22C (or 71F)
    const midTemp = (d.tempMax + d.tempMin) / 2;
    const midTempC = unit === 'fahrenheit' ? (midTemp - 32) * (5 / 9) : midTemp;
    dayScore -= Math.abs(midTempC - 21) * 2;

    if (dayScore > highestDayScore) {
      highestDayScore = dayScore;
      bestDayItem = d;
    }
  });

  const headline = activityRating === 'Excellent'
    ? 'Prime weather conditions across the board'
    : activityRating === 'Good'
    ? 'Favorable conditions with minimal disruptions'
    : activityRating === 'Fair'
    ? 'Manageable conditions with a few atmospheric cautions'
    : activityRating === 'Caution'
    ? 'Weather cautions active — plan around precipitation & wind'
    : 'Severe atmospheric activity — prioritize indoor plans';

  const summary = `${activityRating} rating for outdoor activities (${score}/100). Best window: ${bestOutdoorWindow}. ${outfit.summary}`;

  return {
    overallTone,
    headline,
    summary,
    bestOutdoorWindow,
    activityScore: score,
    activityRating,
    outfit,
    essentialsChecklist,
    commute: {
      walking: commuteWalking,
      cycling: commuteCycling,
      driving: commuteDriving,
      roadCondition,
    },
    lifestyle: {
      airQualityOrVentilation,
      laundryDrying,
      hydrationAlert,
    },
    sevenDayHighlight: {
      bestDay: bestDayItem ? bestDayItem.dayLabel : 'Today',
      date: bestDayItem ? bestDayItem.fullDateLabel : 'Today',
      highlight: bestDayItem
        ? `${bestDayItem.dayLabel} promises optimal outdoor weather with high of ${Math.round(bestDayItem.tempMax)}° and low rain probability (${bestDayItem.precipitationProbabilityMax}%).`
        : 'Stable conditions forecast ahead.',
    },
  };
}
