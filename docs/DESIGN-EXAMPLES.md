# Conversation Examples (Extended)

## Example 1: Weather Query
```
User: "What's the weather like in London?"

[LLM decides to call get_weather]
Tool Call: get_weather({ city: "London" })
Tool Result: { temp: "8°C", condition: "rainy" }