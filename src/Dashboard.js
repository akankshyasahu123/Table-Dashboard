import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { nanoid } from 'nanoid';

function Dashboard() {
  const [data, setData] = useState([]);
  const [showEditModal,setShowEditModal] = useState(false);
  const [showDeleteModal,setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [name,setName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(()=>{
    if(editValue){
        setName(editValue.name);
    }
  },[editValue]);

  const fetchData = async () => {
    try {
      const result = [];  
      const response = await axios.get('https://assets.alippo.com/catalog/static/data.json');
      response.data.forEach(element => {
        result.push({...element,id:nanoid()})
      });
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (rowIndex, value) => {
    setSelectedRow(rowIndex);
    setEditValue(value || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    const updatedData = [...data];
    updatedData.forEach((ele)=>{
        if(ele.id === editValue.id){
            const index = updatedData.findIndex(item => item.id === editValue.id);
            if (index !== -1) {
                updatedData[index] = {...editValue,name}
              }
        }
    })
    setData(updatedData);
    setShowEditModal(false);
    setName("")
  };

  const handleDelete = (rowIndex) => {
    setSelectedRow(rowIndex);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = () => {
    const updatedData = [...data];
    updatedData.splice(selectedRow, 1);
    setData(updatedData);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };


  return (
    <div>
        <h5>Data Table</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>SL.No</th>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
            <th>Column 4</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.city}</td>
              <td>{user.pinCode}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(index, user)}>
                  Edit
                </Button> {' '}
                <Button variant="danger" onClick={() => handleDelete(index)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEditModal} >
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {selectedRow !== null && (
            <Form>
              <Form.Group controlId="editValue">
                <Form.Label>Edit</Form.Label>
                <Form.Control
                  type='text'
                  defaultValue={editValue.name}
                  value={name}
                  onChange={(e) => setName( e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary"
          onClick={handleEditSubmit}>Save
          </Button>
        </Modal.Footer>
      </Modal>


    <Modal show={showDeleteModal}>
       <Modal.Header>
         <Modal.Title>Delete {selectedRow + 1}</Modal.Title>
       </Modal.Header>
        <Modal.Body>
        <h5>Are you sure you want to delete..?</h5>
        </Modal.Body>
        <Modal.Footer>
           <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
            </Button>
           <Button variant="danger" onClick={handleDeleteSubmit}>
           Confirm
          </Button>
         </Modal.Footer>
    </Modal>


    </div>
  );
}

export default Dashboard;