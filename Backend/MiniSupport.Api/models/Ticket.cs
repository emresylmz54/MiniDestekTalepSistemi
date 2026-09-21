namespace MiniSupport.Api.Models;

public enum TicketPriority
{
    Low,
    Medium,
    High
}

public enum TicketStatus
{
    Open,
    InProgress,
    Closed
}

public class Ticket
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Customer { get; set; } = string.Empty;

    public TicketPriority Priority { get; set; }

    public TicketStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? ClosedAt { get; set; }

    // Açık talebin kaç gündür beklediğini hesaplar.
    // Veritabanına kaydedilmez.
    public int WaitingDays
    {
        get
        {
            if (Status != TicketStatus.Open)
                return 0;

            return (DateTime.UtcNow.Date - CreatedAt.Date).Days;
        }
    }
}