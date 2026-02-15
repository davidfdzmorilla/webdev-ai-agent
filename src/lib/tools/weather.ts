import { z } from "zod";

export const weatherToolSchema = z.object({
  city: z.string().describe("City name (e.g., Paris, London, New York)"),
  units: z.enum(["metric", "imperial"]).optional().default("metric").describe("Temperature units"),
});

export type WeatherInput = z.infer<typeof weatherToolSchema>;

export async function getWeather(input: WeatherInput): Promise<string> {
  const { city, units } = input;
  
  try {
    // Use wttr.in API (no key required)
    const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
    
    if (!response.ok) {
      return `Unable to fetch weather data for ${city}`;
    }
    
    const data = await response.json();
    const current = data.current_condition[0];
    
    const temp = units === "imperial" 
      ? `${current.temp_F}°F` 
      : `${current.temp_C}°C`;
    
    const condition = current.weatherDesc[0].value;
    const feelsLike = units === "imperial"
      ? `${current.FeelsLikeF}°F`
      : `${current.FeelsLikeC}°C`;
    
    return `Weather in ${city}: ${temp} (feels like ${feelsLike}), ${condition}. Humidity: ${current.humidity}%, Wind: ${current.windspeedKmph} km/h`;
  } catch (error) {
    console.error("Weather API error:", error);
    return `Error fetching weather data for ${city}`;
  }
}
