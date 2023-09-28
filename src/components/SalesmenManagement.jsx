import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton, // Import IconButton from MUI
} from "@mui/material";
import { mockedSalesmenData } from "../Data";

function SalesmenManagement() {
  // Function to delete a salesman by ID
  const deleteSalesman = (id) => {
    const updatedSalesmen = salesmen.filter((salesman) => salesman.id !== id);
    setSalesmen(updatedSalesmen);
  };

  const [salesmen, setSalesmen] = useState(mockedSalesmenData);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [newSalesman, setNewSalesman] = useState({
    name: "",
    phoneNumber: "",
    balance: 0,
  });

  const openAddDialog = () => {
    setAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
    // Clear the input fields
    setNewSalesman({ name: "", phoneNumber: "", balance: 0 });
  };

  const handleNewSalesmanChange = (e) => {
    const { name, value } = e.target;
    setNewSalesman({ ...newSalesman, [name]: value });
  };

  const addNewSalesman = () => {
    // Generate a unique ID for the new salesman
    const newId =
      salesmen.length > 0
        ? Math.max(...salesmen.map((salesman) => salesman.id)) + 1
        : 1;
    const newSalesmanWithId = { ...newSalesman, id: newId };

    // Add the new salesman to the list
    setSalesmen([...salesmen, newSalesmanWithId]);

    // Close the add dialog
    closeAddDialog();
  };

  // Function to initiate a call
  const initiateCall = (phoneNumber) => {
    // Replace this with your actual code to initiate a call using the phone number
    console.log(`Initiating call to ${phoneNumber}`);
  };

  return (
    <div>
      <h2>Salesmen Management</h2>
      <Button variant="contained" color="primary" onClick={openAddDialog}>
        Add Salesman
      </Button>
      <Dialog open={isAddDialogOpen} onClose={closeAddDialog}>
        <DialogTitle>Add New Salesman</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={newSalesman.name}
            onChange={handleNewSalesmanChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={newSalesman.phoneNumber}
            onChange={handleNewSalesmanChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Balance"
            name="balance"
            type="number"
            value={newSalesman.balance}
            onChange={handleNewSalesmanChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={addNewSalesman} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesmen.map((salesman) => (
              <TableRow key={salesman.id}>
                <TableCell>{salesman.name}</TableCell>
                <TableCell
                  // Add a click event to initiate a call
                  style={{ cursor: "pointer" }}
                  onClick={() => initiateCall(salesman.phoneNumber)}
                >
                  {salesman.phoneNumber}
                </TableCell>
                <TableCell>₹ {salesman.balance}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      // Implement edit functionality here
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => deleteSalesman(salesman.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default SalesmenManagement;
