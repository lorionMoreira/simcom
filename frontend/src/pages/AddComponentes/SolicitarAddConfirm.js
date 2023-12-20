import React, { useState , useEffect} from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  CardTitle,
  CardText,
  Table,
  Input
} from "reactstrap";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { del, get, post, put } from "../../helpers/api_helper";


const SolicitarAddConfirm = () => {
  const location = useLocation();

  const selectedRows = location.state?.selectedRows || [];

  const navigate = useNavigate();

 
  console.log('Selected Rows1:', selectedRows); // Add this console.log to check the received data

  //meta title
  document.title = "Cart | Skote - React Admin & Dashboard Template";



  const [selectedGroup, setselectedGroup] = useState(null);
  const [optionGroup, setoptionGroup] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [colorAlert, setcolorAlert] = useState('success');


  const updatedList = selectedRows.map((item) => ({
    ...item,
    quantidade: 1
  }));
  const [productList, setproductList] = useState(updatedList);

  console.log('Selected Rows2:', productList); 

  console.log("productList")
  console.log(productList)

  function removeCartItem(id) {
    var filtered = productList.filter(function (item) {
      return item.id !== id;
    });

    setproductList(filtered);
  }

  function handleSelectGroup(selectedGroup) {
    setselectedGroup(selectedGroup);

    const updatedList = productList.map((item) => ({
      ...item,
      userId: selectedGroup.value
    }));

    setproductList(updatedList)
    setIsButtonDisabled(false)
  }

  useEffect(() => {
    fetchUsers()
  }, []);

    // Custom styles object for styling the dropdown
    const customStyles = {
      option: (provided) => ({
        ...provided,
        color: 'black',        // Change the color of the text
        fontSize: '16px',     // Change the font size
      }),
    };

  const fetchUsers = async () => {
    try {
      
      const response = await get('/api/clientes');
      console.log("response")
      console.log(response)
      const transformedData = response.map((item) => ({
        label: `Professor(a): ${item.nome}`,
        value: item.id,
      }));
      console.log(transformedData)
  
      setoptionGroup(transformedData);
      setisLoading(false);

    } catch (error) {
     

    }
  };

  function countUP(id, prev_data_attr, qtdDisponivel) {
    if (prev_data_attr < qtdDisponivel) {
      setproductList(
        productList.map(p =>
          p.id === id ? { ...p, quantidade: prev_data_attr + 1 } : p
        )
      );
    }
  }

  function countDown(id, prev_data_attr) {
    if (prev_data_attr > 1) {
      setproductList(
        productList.map(p =>
          p.id === id ? { ...p, quantidade: prev_data_attr - 1 } : p
        )
      );
    }
  }

  const handleNumberChange = (id, event) => {
    const inputValue = parseInt(event.target.value, 10);
    
    // Check if the input is a valid number starting from 1
    if (!isNaN(inputValue) && inputValue >= 1) {
      
      setproductList(
        productList.map(p =>
          p.id === id ? { ...p, quantidade: inputValue > p.qtdDisponivel ? p.qtdDisponivel : inputValue} : p
        )
      );

    }
  };

  const handleEnviarClick = async () => {
    try {
      console.log(productList)
    
    const ModifiedListWrapper = productList.map(({ especificacao,nome,valor,unidade, ...rest }) => rest);
    console.log("ModifiedListWrapper")
    console.log(ModifiedListWrapper)
   

      // Perform the AJAX post request using Axios
      const response = await post(`/api/componentes/salvartodos`, ModifiedListWrapper);

      console.log(response);

      setAlert(true);
      setAlertMsg('Componente adicionado com sucesso!');
      setcolorAlert('success');

      setTimeout(() => {
        navigate('/componentes/solicitar');
      }, 3000);
 

    } catch (error) {
      // Handle any errors that occurred during the AJAX request
      console.error('Error sending the request:', error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Ecommerce" breadcrumbItem="Cart" />
          <Alert color={colorAlert} isOpen={alert} toggle={() => {
                setAlert(false)
              }}>
                {alertMsg}
          </Alert>
          <Row>

            <Col xl={9}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table align-middle mb-0 table-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th>Id</th>
                          <th>Nome</th>
                          <th>Especificação</th>
                          <th>Disponibilidade</th>
                          <th>Quantidade</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {productList.map(product => (
                          <tr key={product.id}>
                            <td>
                            {product.id}
                            </td>
                            <td>
                              <h5 className="font-size-14 text-truncate">
                                <Link
                                  to={"/ecommerce-product-detail/" + product.id}
                                  className="text-dark"
                                >
                                  {product.nome}
                                </Link>
                              </h5>
                              <p className="mb-0">
                                Valor :{" "}
                                <span className="fw-medium">
                                  {product.valor + product.unidade}
                                </span>
                              </p>
                            </td>
                            <td> {product.especificacao}</td>
                            <td> {product.qtdDisponivel} Und(s)</td>
                            <td>

                              <div style={{ width: "120px" }}>
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={() => {
                                        countUP(product.id, product.quantidade, product.qtdDisponivel);
                                      }}>+
                                    </button>
                                  </div>
                                  <Input
                                    type="text"
                                    value={product.quantidade}
                                    name="demo_vertical"
                                    onChange={() => {
                                      handleNumberChange(product.id,event)
                                    } }
                                    
                                  />
                                  <div className="input-group-append">
                                    <button type="button" className="btn btn-primary"
                                      onClick={() => {
                                        countDown(product.id, product.quantidade);
                                      }}>-</button>
                                  </div>
                                </div>
                              </div>

                            </td>
                            
                            <td>
                              <Link
                                to="#"
                                onClick={() => removeCartItem(product.id)}
                                className="action-icon text-danger"
                              >
                                {" "}
                                <i className="mdi mdi-trash-can font-size-18" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <Row className="mt-4">
                    <Col sm="6">
                      <Link
                        to={`/experimentoadd/`}
                        className="btn btn-secondary"
                      >
                        <i className="mdi mdi-arrow-left me-1" /> Continue
                        Shopping{" "}
                      </Link>
                    </Col>
                    <Col sm="6">
                      <div className="text-sm-end mt-2 mt-sm-0">
                        <button
                          className="btn btn-success"
                          onClick={handleEnviarClick}
                          disabled={isButtonDisabled}
                        >
                          Enviar
                        </button>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3}>
              <Card>
                <CardBody>
                  <CardTitle className="mt-0">
                    SELECIONAR USUÁRIO
                  </CardTitle>
                  <CardText>
                      Selecione o professor a receber o empréstimo na lista abaixo.
                  </CardText>
                  <Select
                    value={selectedGroup}
                    onChange={handleSelectGroup}
                    options={optionGroup}
                    className="select2-selection"
                    isLoading={isLoading}
                    styles={customStyles}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SolicitarAddConfirm;
