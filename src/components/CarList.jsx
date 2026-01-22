function CarList() {
  return (
    <>
      <h3>Used Cars</h3>

      <div className="cars-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="car-card">
            Car Card {index + 1}
          </div>
        ))}
      </div>
    </>
  );
}

export default CarList;
