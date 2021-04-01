import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Form } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { firestore, auth } from "../../firebase"

class Employee extends Component {
    constructor() {
        super();
        this.state = {
            employees_list: [],
            empid: "",
            name: "",
            email: "",
            phone: "",
            dob: "",
            address: "",
            add_edit_details: null,
            show: false,
            add_edit_flag: false,
            add_modal_show: false,
            delete_modal_show: false,
            errors: {}
        };
    }

    componentDidMount = async () => {
        firestore
            .collection("Employee")
            .orderBy("name", "asc")
            .onSnapshot((querySnapshot) => {
                let employees = [];
                querySnapshot.forEach((doc) => {
                    const employee_data = doc.data();
                    employee_data.id = doc.id;
                    employees.push(employee_data);
                });
                this.setState({
                    employees_list: employees,
                    last_page_number: Math.ceil(employees.length / this.state.post_per_page)
                });
            });
    };

    closeEmployeeDeleteModal = () => {
        this.setState({ delete_modal_show: false });
    };

    showEmployeeDeleteModal = (id) => {
        this.setState({ delete_modal_show: true, employees_id: id });
    };

    deleteEmployee = (event) => {
        firestore
            .collection("Employee")
            .doc(this.state.employees_id)
            .delete()
            .then(() => {
                this.setState({ delete_modal_show: false });
                firestore
                    .collection("Employee")
                    .orderBy("name", "asc")
                    .get()
                    .then((querySnapshot) => {
                        let employees = [];
                        querySnapshot.forEach((doc) => {
                            const employee_data = doc.data();
                            employee_data.id = doc.id;
                            employees.push(employee_data);
                        });
                        this.setState({
                            employees_list: employees
                        });
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    };


    closeEmployeeModal = () => {
        this.setState({
            empid: "",
            name: "",
            phone: "",
            email: "",
            dob: "",
            address:"",
            errors: "",
            add_modal_show: false,
            add_edit_details: false
        });
    };

    addEditEmployee = (flag, id) => {
        this.setState({
            add_modal_show: true,
            add_edit_flag: flag === "add" ? true : false,
            employees_id: id
        });
        if (id) {
            firestore
                .collection("Employee")
                .doc(id)
                .get()
                .then((result) => {
                    const data = result.data();
                    this.setState({
                        add_edit_details: true,
                        empid: data.empid,
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        dob: data.dob,
                        address: data.address
                    });
                });
        } else {
            this.setState({
                add_edit_details: null
            });
        }
    };


    handleChange = (event) => {
        const { email } = this.state;
        let errors = {};
        let { name, value } = event.target;
        const email_pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/;
        switch (name) {
            case "empid":
                errors.empid = value.length == 0 ? "*This field is required":"";
            case "name":
                errors.name = value.length == 0 ? "*This field is required" : "";
                break;
            case "email":
                errors.email = email_pattern.test(email) || value.length == 0 ? "*This field is required and must have email format" : "";
                break;
            case "address":
                errors.address = value.length == 0 ? "*This field is required":"";
            case "phone":
                errors.phone = value.length === 0 ? "*This field is required" : "";
                break;
            case "dob":
                errors.dob = value.length === 0 ? "*This field is required" : "";
                break;
            default:
                break;
        }
        this.setState({
            [event.target.name]: event.target.value,
            errors: errors
        });
    };

    handleValidation = () => {
        const { empid, name, email, address, phone, dob } = this.state;
        let valid_form = true;
        let errors = {};
        const email_pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/;
        const phone_pattern = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
        if (!empid){
            errors.empid = "*This field is required.";
            valid_form = false;
        }
        if (!name) {
            errors.name = "*This field is required.";
            valid_form = false;
        }
        if (!email) {
            errors.email = "*This field is required.";
            valid_form = false;
        } else if (!email_pattern.test(email)) {
            errors.email = "This field must have email format.";
            valid_form = false;
        }
        if (!address) {
            errors.address = "*This field is required.";
            valid_form = false;
        }
        if (!phone) {
            errors.phone = "*This field is required.";
            valid_form = false;
        } else if (!phone_pattern.test(phone)) {
            errors.phone = "This field must have phone format.";
            valid_form = false;
        }
        if (!dob) {
            errors.dob = "*This field is required";
            valid_form = false;
        }
        this.setState({ errors: errors });
        return valid_form;
    };

    submitEmployee = async (event) => {
        event.preventDefault();
        var user = auth.currentUser;
        if (this.handleValidation()) {
            if (this.state.add_edit_flag) {
                await firestore
                    .collection("Employee")
                    .doc()
                    .set({
                        empid: this.state.empid,
                        name: this.state.name,
                        email: this.state.email,
                        phone: this.state.phone,
                        dob: this.state.dob,
                        address: this.state.address
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                await firestore.collection("Employee").doc(this.state.employees_id).update({
                    empid: this.state.empid,
                    name: this.state.name,
                    email: this.state.email,
                    phone: this.state.phone,
                    dob: this.state.dob,
                    address: this.state.address
                });
            }
            this.setState({
                empid: "",
                name: "",
                phone: "",
                email: "",
                dob: "",
                address: "",
                add_modal_show: false,
                add_edit_details: false
            });
            firestore
                .collection("Employee")
                .orderBy("name", "asc")
                .get()
                .then((querySnapshot) => {
                    let employees = [];
                    querySnapshot.forEach((doc) => {
                        const employee_data = doc.data();
                        employee_data.id = doc.id;
                        employees.push(employee_data);
                    });
                    this.setState({employees_list: employees });
                });
        }
    };

    render() {
        let employeeList;
        employeeList = this.state.employees_list.map((employee_list, index) => {
            return (
                <tr key={employee_list.id}>
                    <td>{employee_list.empid}    </td>
                    <td>{employee_list.name}</td>
                    <td>{employee_list.email}</td>
                    <td>{employee_list.address}</td>
                    <td>{employee_list.dob}</td>
                    <td>{employee_list.phone}</td>
                    <td>
                        <FaEdit onClick={() => this.addEditEmployee("edit", employee_list.id)} />
                        <RiDeleteBin5Fill onClick={() => this.showEmployeeDeleteModal(employee_list.id)} />
                    </td>
                </tr>
            );
        });

        return (
            <>  
                <div style={{float:'right'}}>
                <Row className="p-0 m-0" style={{ height: "100px" }}>
                    <Col sm="auto" className="my-auto left_move" >
                        <Button className="popup_button" onClick={() => this.addEditEmployee("add", null)}>
                            Add Employee
                        </Button>
                    </Col>
                </Row>
                </div>
                {/* Add employee form */}
                <Modal show={this.state.add_modal_show} onHide={this.closeEmployeeModal} animation={true}>
                    <Modal.Header className="text-center mod_head" closeButton>
                        <Modal.Title className="w-100">Employee Details</Modal.Title>
                        <br />
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                        <Form.Group controlId="formPlaintextEmpid">
                                <Form.Control
                                    className="mod_input"
                                    size="sm"
                                    name="empid"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="Employee ID"
                                    defaultValue={this.state.add_edit_details ? this.state.empid : ""}
                                />
                                <Form.Text className="text-danger">{this.state.errors.empid}</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formPlaintextName">
                                <Form.Control
                                    className="mod_input"
                                    size="sm"
                                    name="name"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="FullName"
                                    defaultValue={this.state.add_edit_details ? this.state.name : ""}
                                />
                                <Form.Text className="text-danger">{this.state.errors.name}</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formPlaintextEmail">
                                <Form.Control
                                    className="mod_input"
                                    size="sm"
                                    name="email"
                                    type="email"
                                    onChange={this.handleChange}
                                    placeholder="Email"
                                    defaultValue={this.state.add_edit_details ? this.state.email : ""}
                                />
                                <Form.Text className="text-danger">{this.state.errors.email}</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formPlaintextAddress">
                                <Form.Control
                                    className="mod_input"
                                    size="sm"
                                    name="address"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="Address"
                                    defaultValue={this.state.add_edit_details ? this.state.address : ""}
                                />
                                <Form.Text className="text-danger">{this.state.errors.address}</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formPlaintextPhone">
                                <Form.Control
                                    className="mod_input"
                                    size="sm"
                                    name="phone"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="Phone no."
                                    defaultValue={this.state.add_edit_details ? this.state.phone : ""}
                                />
                                <Form.Text className="text-danger">{this.state.errors.phone}</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formPlaintextDob">
                                <Form.Control
                                    className="mod_input"
                                    size="sm"
                                    name="dob"
                                    type="date"
                                    onChange={this.handleChange}
                                    placeholder="Joining date"
                                    defaultValue={this.state.add_edit_details ? this.state.dob : ""}
                                />
                                <Form.Text className="text-danger">{this.state.errors.dob}</Form.Text>
                            </Form.Group>
                            <Button className="edit_button" type="submit" onClick={this.submitEmployee}>
                                {this.state.add_edit_flag == false ? "Save" : "Add"}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* delete employee modal */}
                <Modal show={this.state.delete_modal_show} onHide={this.closeEmployeeDeleteModal} animation={true}>
                    <Modal.Header className="mod_head text-center" closeButton>
                        <Modal.Title className="w-100">Delete Employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h6 className="text-center">Are you sure, you want to delete the employee?</h6>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="delete_button" onClick={this.deleteEmployee}>
                            Yes
                        </Button>
                        <Button className="delete_button" onClick={this.closeEmployeeDeleteModal}>
                            No
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Table striped hover responsive className="table_width mx-auto">
                    <thead className="text-left">
                        <tr>
                            <th>Emp ID.</th>
                            <th>Employee Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>DOB</th>
                            <th>Mobile</th>
                            <th>Edit/Delete</th>
                        </tr>
                    </thead>
                    <tbody className="text-left">{employeeList}</tbody>
                </Table>
            </>
        );
    }
}

export default Employee;
