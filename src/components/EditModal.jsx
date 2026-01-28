const EditModal = ({ movie, note, setNote, onSave, onCancel }) => {
  if (!movie) return null; // Modal tidak muncul jika tidak ada film yang dipilih

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>MODIFIKASI DATA: {movie.title}</h4>
        <form onSubmit={onSave}>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Masukkan catatan strategis untuk film ini..."
          />
          <div className="modal-buttons">
            <button type="submit" className="btn-save">SIMPAN</button>
            <button type="button" onClick={onCancel} className="btn-cancel">BATAL</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;