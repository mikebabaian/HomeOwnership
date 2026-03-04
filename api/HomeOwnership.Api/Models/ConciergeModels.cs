namespace HomeOwnership.Api.Models;

public record ConciergeMessageDto(string Role, string Content, DateTime CreatedUtc);

public record ConciergeHistoryResponse(List<ConciergeMessageDto> Messages);

public record ConciergeSendRequest(string Message);

public record ConciergeSendResponse(string Reply, DateTime CreatedUtc);
