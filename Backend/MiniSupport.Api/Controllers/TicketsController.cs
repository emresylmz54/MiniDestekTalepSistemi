using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniSupport.Api.Data;
using MiniSupport.Api.Models;

namespace MiniSupport.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TicketsController(AppDbContext context)
    {
        _context = context;
    }

    // 1. Talepleri listele + filtrele
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets(
        TicketStatus? status = null,
        TicketPriority? priority = null)
    {
        var query = _context.Tickets.AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        if (priority.HasValue)
        {
            query = query.Where(t => t.Priority == priority.Value);
        }

        var tickets = await query
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return Ok(tickets);
    }

    // 2. Tek talep getir
    [HttpGet("{id}")]
    public async Task<ActionResult<Ticket>> GetTicket(int id)
    {
        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket == null)
        {
            return NotFound(new { message = "Talep bulunamadı." });
        }

        return Ok(ticket);
    }

    // 3. Yeni talep oluştur
    [HttpPost]
    public async Task<ActionResult<Ticket>> CreateTicket(Ticket ticket)
    {
        if (string.IsNullOrWhiteSpace(ticket.Title))
        {
            return BadRequest(new { message = "Başlık boş bırakılamaz." });
        }

        ticket.Id = 0;
        ticket.CreatedAt = DateTime.UtcNow;
        ticket.Status = TicketStatus.Open;
        ticket.ClosedAt = null;

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetTicket),
            new { id = ticket.Id },
            ticket);
    }

    // 4. Talep güncelle
    [HttpPut("{id}")]
    public async Task<ActionResult<Ticket>> UpdateTicket(
        int id,
        Ticket updatedTicket)
    {
        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket == null)
        {
            return NotFound(new { message = "Talep bulunamadı." });
        }

        if (string.IsNullOrWhiteSpace(updatedTicket.Title))
        {
            return BadRequest(new { message = "Başlık boş bırakılamaz." });
        }

        ticket.Title = updatedTicket.Title;
        ticket.Description = updatedTicket.Description;
        ticket.Customer = updatedTicket.Customer;
        ticket.Priority = updatedTicket.Priority;

        await _context.SaveChangesAsync();

        return Ok(ticket);
    }

    // 5. Talep durumunu değiştir
    [HttpPatch("{id}/status")]
    public async Task<ActionResult<Ticket>> ChangeStatus(
        int id,
        [FromBody] TicketStatus newStatus)
    {
        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket == null)
        {
            return NotFound(new { message = "Talep bulunamadı." });
        }

        ticket.Status = newStatus;

        if (newStatus == TicketStatus.Closed)
        {
            ticket.ClosedAt = DateTime.UtcNow;
        }
        else
        {
            ticket.ClosedAt = null;
        }

        await _context.SaveChangesAsync();

        return Ok(ticket);
    }
}