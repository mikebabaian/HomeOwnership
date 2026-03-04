using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace HomeOwnership.Api.Services;

/// <summary>
/// Thin wrapper around the OpenAI Chat Completions API.
/// Reads OpenAI__ApiKey, OpenAI__Model, OpenAI__BaseUrl from configuration.
/// </summary>
public sealed class OpenAiChatService
{
    private readonly HttpClient _http;
    private readonly string _model;

    private const string SystemPrompt =
        """
        You are "Home Owner Concierge," a friendly, practical AI assistant that helps
        homeowners with budgeting, savings tips, home maintenance planning, mortgage
        questions, insurance, and general home-ownership advice.
        Keep answers concise and action-oriented. If you don't know something, say so.
        Never provide specific legal, tax, or financial-planning advice—recommend the user
        consult a licensed professional when appropriate.
        """;

    public OpenAiChatService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _model = config["OpenAI:Model"] ?? "gpt-4o-mini";

        var baseUrl = config["OpenAI:BaseUrl"]?.TrimEnd('/') ?? "https://api.openai.com/v1";
        _http.BaseAddress = new Uri(baseUrl + "/");

        var apiKey = config["OpenAI:ApiKey"];
        if (!string.IsNullOrEmpty(apiKey))
            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var org = config["OpenAI:Organization"];
        if (!string.IsNullOrEmpty(org))
            _http.DefaultRequestHeaders.Add("OpenAI-Organization", org);
    }

    /// <summary>
    /// Send conversation history to OpenAI and return the assistant reply.
    /// <paramref name="history"/> should be in chronological order (role + content pairs).
    /// </summary>
    public async Task<string> GetCompletionAsync(
        IReadOnlyList<(string Role, string Content)> history,
        CancellationToken ct = default)
    {
        var messages = new List<object>
        {
            new { role = "system", content = SystemPrompt }
        };

        foreach (var (role, content) in history)
            messages.Add(new { role, content });

        var payload = new
        {
            model = _model,
            messages,
            max_tokens = 1024,
            temperature = 0.7,
        };

        var json = JsonSerializer.Serialize(payload);
        var request = new HttpRequestMessage(HttpMethod.Post, "chat/completions")
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };

        var response = await _http.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadAsStringAsync(ct);
        using var doc = JsonDocument.Parse(body);
        var choice = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return choice?.Trim() ?? "(No response from AI)";
    }
}
