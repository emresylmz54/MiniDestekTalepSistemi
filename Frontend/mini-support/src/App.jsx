import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5290/api/Tickets";

function getPriorityText(priority) {
  if (priority === 0) return "Düşük";
  if (priority === 1) return "Orta";
  if (priority === 2) return "Yüksek";
  return "-";
}

function getStatusText(status) {
  if (status === 0) return "Açık";
  if (status === 1) return "İşlemde";
  if (status === 2) return "Kapandı";
  return "-";
}

function getPriorityClass(priority) {
  if (priority === 0) return "priority-low";
  if (priority === 1) return "priority-medium";
  if (priority === 2) return "priority-high";
  return "";
}

function getStatusClass(status) {
  if (status === 0) return "status-open";
  if (status === 1) return "status-progress";
  if (status === 2) return "status-closed";
  return "";
}

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");
const [newDescription, setNewDescription] = useState("");
const [newCustomer, setNewCustomer] = useState("");
const [newPriority, setNewPriority] = useState("0");

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API bağlantı hatası:", error);
        setLoading(false);
      });
  }, []);

  const openCount = tickets.filter(
    (ticket) => ticket.status === 0
  ).length;

  const progressCount = tickets.filter(
    (ticket) => ticket.status === 1
  ).length;

  const closedCount = tickets.filter(
    (ticket) => ticket.status === 2
  ).length;

  const createTicket = async () => {
  if (!newTitle.trim()) {
    alert("Başlık boş bırakılamaz.");
    return;
  }

  const newTicket = {
    title: newTitle,
    description: newDescription,
    customer: newCustomer,
    priority: Number(newPriority),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTicket),
    });

    if (!response.ok) {
      throw new Error("Talep oluşturulamadı.");
    }

    const createdTicket = await response.json();

    setTickets((prevTickets) => [
      createdTicket,
      ...prevTickets,
    ]);

    setNewTitle("");
    setNewDescription("");
    setNewCustomer("");
    setNewPriority("0");
    setShowForm(false);

    alert("Talep başarıyla oluşturuldu.");
  } catch (error) {
    console.error(error);
    alert("Talep oluşturulurken bir hata oluştu.");
  }
};
const updateTicket = async () => {
  if (!selectedTicket.title.trim()) {
    alert("Başlık boş bırakılamaz.");
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/${selectedTicket.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedTicket),
      }
    );

    if (!response.ok) {
      throw new Error("Talep güncellenemedi.");
    }

    const updatedTicket = await response.json();

    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === updatedTicket.id
          ? updatedTicket
          : ticket
      )
    );

    setSelectedTicket(updatedTicket);
    setEditMode(false);

    alert("Talep başarıyla güncellendi.");
  } catch (error) {
    console.error(error);
    alert("Talep güncellenirken bir hata oluştu.");
  }
};
const deleteTicket = async () => {
  const confirmed = window.confirm(
    "Bu talebi silmek istediğinize emin misiniz?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/${selectedTicket.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Talep silinemedi.");
    }

    setTickets((prevTickets) =>
      prevTickets.filter(
        (ticket) => ticket.id !== selectedTicket.id
      )
    );

    setSelectedTicket(null);
    setEditMode(false);

    alert("Talep başarıyla silindi.");
  } catch (error) {
    console.error(error);
    alert("Talep silinirken bir hata oluştu.");
  }
};
const changeStatus = async (newStatus) => {
  try {
    const response = await fetch(
      `${API_URL}/${selectedTicket.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStatus),
      }
    );

    if (!response.ok) {
      throw new Error("Durum değiştirilemedi.");
    }

    const updatedTicket = await response.json();

    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === updatedTicket.id
          ? updatedTicket
          : ticket
      )
    );

    setSelectedTicket(updatedTicket);
  } catch (error) {
    console.error(error);
    alert("Durum değiştirilirken bir hata oluştu.");
  }
};  
const filteredTickets = tickets.filter((ticket) => {
  const statusMatches =
    statusFilter === "" ||
    ticket.status === Number(statusFilter);

  const priorityMatches =
    priorityFilter === "" ||
    ticket.priority === Number(priorityFilter);

  const searchMatches =
    searchText === "" ||
    ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchText.toLowerCase());

  return statusMatches && priorityMatches && searchMatches;
});

  return (
    <div>
      <h1>Mini Destek Talep Takip Sistemi</h1>

      <div className="summary">
        <div className="summary-card open-card">
          <h3>Açık</h3>
          <p>{openCount}</p>
        </div>

        <div className="summary-card progress-card">
          <h3>İşlemde</h3>
          <p>{progressCount}</p>
        </div>

        <div className="summary-card closed-card">
          <h3>Kapandı</h3>
          <p>{closedCount}</p>
        </div>
      </div>

      <hr />

      <div className="filters">
      <input
  type="text"
  placeholder="Talep ara..."
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
/>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tüm Durumlar</option>
          <option value="0">Açık</option>
          <option value="1">İşlemde</option>
          <option value="2">Kapandı</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">Tüm Öncelikler</option>
          <option value="0">Düşük</option>
          <option value="1">Orta</option>
          <option value="2">Yüksek</option>
        </select>
      </div>

     <button
  className="new-ticket-button"
  onClick={() => setShowForm(true)}
>
  + Yeni Talep
</button>
{showForm && (
  <div className="ticket-form">
    <h2>Yeni Destek Talebi</h2>

    <input
  type="text"
  placeholder="Başlık"
  value={newTitle}
  onChange={(e) => setNewTitle(e.target.value)}
/>

    <textarea
  placeholder="Açıklama"
  rows="4"
  value={newDescription}
  onChange={(e) => setNewDescription(e.target.value)}
/>

    <input
  type="text"
  placeholder="Müşteri"
  value={newCustomer}
  onChange={(e) => setNewCustomer(e.target.value)}
/>

    <select
  value={newPriority}
  onChange={(e) => setNewPriority(e.target.value)}
>
  <option value="0">Düşük</option>
  <option value="1">Orta</option>
  <option value="2">Yüksek</option>
</select>

    <div>
      <button
  className="create-button"
  onClick={createTicket}
>
  Talep Oluştur
</button>

      <button
        className="cancel-button"
        onClick={() => setShowForm(false)}
      >
        İptal
      </button>
    </div>
  </div>
)}
      {selectedTicket && (
  <div className="ticket-detail">
    <h2>Talep Detayı</h2>
    {editMode ? (
  <div className="edit-form">
    <input
      type="text"
      value={selectedTicket.title}
      onChange={(e) =>
        setSelectedTicket({
          ...selectedTicket,
          title: e.target.value,
        })
      }
    />

    <textarea
      rows="4"
      value={selectedTicket.description}
      onChange={(e) =>
        setSelectedTicket({
          ...selectedTicket,
          description: e.target.value,
        })
      }
    />

    <input
      type="text"
      value={selectedTicket.customer}
      onChange={(e) =>
        setSelectedTicket({
          ...selectedTicket,
          customer: e.target.value,
        })
      }
    />

    <select
      value={selectedTicket.priority}
      onChange={(e) =>
        setSelectedTicket({
          ...selectedTicket,
          priority: Number(e.target.value),
        })
      }
    >
      <option value="0">Düşük</option>
      <option value="1">Orta</option>
      <option value="2">Yüksek</option>
    </select>

    <button
      className="save-button"
      onClick={updateTicket}
    >
      Değişiklikleri Kaydet
    </button>

    <button
      className="cancel-button"
      onClick={() => setEditMode(false)}
    >
      İptal
    </button>
  </div>
) : (
  <>
    <p>
      <strong>Başlık:</strong> {selectedTicket.title}
    </p>

    <p>
      <strong>Açıklama:</strong> {selectedTicket.description}
    </p>

    <p>
      <strong>Müşteri:</strong> {selectedTicket.customer}
    </p>

    <p>
      <strong>Öncelik:</strong>{" "}
      {getPriorityText(selectedTicket.priority)}
    </p>

    <p>
      <strong>Durum:</strong>{" "}
      {getStatusText(selectedTicket.status)}
    </p>

    <p>
      <strong>Bekleme Süresi:</strong>{" "}
      {selectedTicket.waitingDays} gün
    </p>

    <button
      className="edit-button"
      onClick={() => setEditMode(true)}
    >
      Talebi Güncelle
    </button>
    <button
  className="delete-button"
  onClick={deleteTicket}
>
  Talebi Sil
</button>
  </>
)}


    <div className="status-buttons">
  <button onClick={() => changeStatus(0)}>
    Açık
  </button>

  <button onClick={() => changeStatus(1)}>
    İşlemde
  </button>

  <button onClick={() => changeStatus(2)}>
    Kapandı
  </button>
</div>
<button
  className="close-detail-button"
  onClick={() => {
  setSelectedTicket(null);
  setEditMode(false);
}}
>
  Detayı Kapat
</button>
  </div>
)}
      <h2>Destek Talepleri</h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : filteredTickets.length === 0 ? (
        <p>Filtreye uygun destek talebi bulunmuyor.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Müşteri</th>
              <th>Öncelik</th>
              <th>Durum</th>
              <th>Bekleme Süresi</th>
            </tr>
          </thead>

          <tbody>
            {filteredTickets.map((ticket) => (
              <tr
  key={ticket.id}
  onClick={() => setSelectedTicket(ticket)}
  style={{ cursor: "pointer" }}
>
                <td>{ticket.title}</td>

                <td>{ticket.customer}</td>

                <td className={getPriorityClass(ticket.priority)}>
                  {getPriorityText(ticket.priority)}
                </td>

                <td className={getStatusClass(ticket.status)}>
                  {getStatusText(ticket.status)}
                </td>

                <td>{ticket.waitingDays} gün</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;