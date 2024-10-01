import React, { useEffect, useState } from "react";
import { Button, Modal } from 'react-bootstrap'
import './Style.css';
  
const TheaterView = () => {
    const rows = 5;  
  const seatsRow = 10;

  
  const initialSeats = Array.from({ length: rows * seatsRow }, (_, i) => ({
    seatNumber: i + 1,
    isReserved: false,
    isSelected: false,
  }));

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [seats, setSeats] = useState(initialSeats); 
  const [numberOfSeats, setNumberOfSeats] = useState(1); 
  const [selectedSeats, setSelectedSeats] = useState([]); 

  
  useEffect(() => {
    const reservedSeats = [5, 8, 12, 15, 22, 25];
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        reservedSeats.includes(seat.seatNumber)
          ? { ...seat, isReserved: true }
          : seat
      )
    );
  }, []);

 
  const findAdjacentSeats = (seatIndex) => {
    const adjacentSeats = [];
    for (let i = 0; i < numberOfSeats; i++) {
      const nextSeat = seatIndex + i;
      if (seats[nextSeat] && !seats[nextSeat].isReserved && !adjacentSeats.includes(nextSeat)) {
        adjacentSeats.push(nextSeat);
      } else {
        return []; 
      }
    }
    return adjacentSeats;
  };


  const handleSeatClick = (seatIndex) => {
    const clickedSeat = seats[seatIndex];
    
   
    if (clickedSeat.isSelected) {
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          seat.isSelected ? { ...seat, isSelected: false } : seat
        )
      );
      setSelectedSeats([]);
    } else {
      const adjacentSeats = findAdjacentSeats(seatIndex);

    
      if (adjacentSeats.length === numberOfSeats) {
        setSeats((prevSeats) =>
          prevSeats.map((seat, index) =>
            adjacentSeats.includes(index)
              ? { ...seat, isSelected: true }
              : { ...seat, isSelected: false }
          )
        );
        setSelectedSeats(adjacentSeats);
      } else {
        alert(`Cannot select ${numberOfSeats} adjacent seats from seat ${seatIndex + 1}.`);
      }
    }
  };

  
  const Booking = () => {
    if (selectedSeats.length === numberOfSeats) {
      alert(`Seats booked: ${selectedSeats.map((index) => seats[index].seatNumber).join(', ')}`);
    } else {
      alert(`Please select ${numberOfSeats} seats.`);
    }
  };
  return (
    <div className="seats-grid">
   <h1 style={{textAlign:'center'}}>Movie Ticket Booking</h1>


<button onClick={handleShow} style={{background:'black',color:'white',borderRadius:'2px',marginLeft:'20px'}}>Seats</button>



<div className="theater-view">
  {Array.from({ length: rows }).map((_, rowIndex) => (
    <div key={rowIndex} className="seat-row">
      {seats.slice(rowIndex * seatsRow, (rowIndex + 1) * seatsRow).map((seat, index) => (
        <button
          key={seat.seatNumber}
          className={`seat ${
            seat.isReserved ? 'reserved' : seat.isSelected ? 'selected' : ''
          }`}
          onClick={() => handleSeatClick(rowIndex * seatsRow + index)}
          disabled={seat.isReserved}
        >
          {seat.seatNumber}
        </button>
      ))}
    </div>
  ))}
</div>


<button onClick={Booking} style={{background:'black',color:'white',borderRadius:'2px',marginLeft:'20px'}}>Book Seats</button>

<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>How Many Seats ?</Modal.Title>
        </Modal.Header>
        <Modal.Body> <label htmlFor="seatCount">Number of seats to book: </label>
  <input
    type="number"
    id="seatCount"
    value={numberOfSeats}
    min="1"
    max="5"
    onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
  /></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button style={{backgroundColor:'black'}} onClick={handleClose}>
            Select Seats
          </Button>
        </Modal.Footer>
      </Modal>

    </div>

    
  );
};

export default TheaterView;
