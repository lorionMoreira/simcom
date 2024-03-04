import React, { useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Input,
  CardTitle
} from "reactstrap";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { del, get, post, put } from "../../helpers/api_helper";


const AddExperimentoConf = () => {
  const location = useLocation();
  const { experimentoId } = useParams();
  const selectedRows = location.state?.selectedRows || [];

  const navigate = useNavigate();

 
  console.log('Selected Rows1:', selectedRows); // Add this console.log to check the received data
  console.log('Selected Rows2:', experimentoId); // Add this console.log to check the received data
  //meta title
  document.title = "Cart | Skote - React Admin & Dashboard Template";

  const updatedList = selectedRows.map((item) => ({
    ...item,
    quantidade: 2
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

  function countUP(id, prev_data_attr) {
    setproductList(
      productList.map(p =>
        p.id === id ? { ...p, quantidade: prev_data_attr + 1 } : p
      )
    );
  }

  function countDown(id, prev_data_attr) {
    setproductList(
      productList.map(p =>
        p.id === id ? { ...p, quantidade: prev_data_attr - 1 } : p
      )
    );
  }

  const handleEnviarClick = async () => {
    try {
      console.log(productList)
    
    const ModifiedListWrapper = productList.map(({ especificacao,nome,valor,id,unidade, ...rest }) => rest);
    console.log("ModifiedListWrapper")
    console.log(ModifiedListWrapper)
   

      // Perform the AJAX post request using Axios
      const response = await post(`/api/reservas/salvartodos/${experimentoId}`, ModifiedListWrapper);
      navigate(`/experimentoadd/${experimentoId}`);
      // Check if the request was successful
      if (response.status === 200) {
      //  history.push(`/success-page/${savedData.id}`);
    
      } else {
        // Request failed
        // Handle the error here if needed
      }
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

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table align-middle mb-0 table-nowrap">
                      <thead className="table-light">
                        <tr>
                          
                          <th>Nome</th>
                          <th>Especificação</th>
                          <th>Quantidade</th>
                          <th>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productList.map(product => (
                          <tr key={product.id}>

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
                            <td>

                              <div style={{ width: "120px" }}>
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={() => {
                                        countUP(product.id, product.quantidade);
                                      }}>+
                                    </button>
                                  </div>
                                  <Input
                                    type="text"
                                    value={product.quantidade}
                                    name="demo_vertical"
                                    readOnly
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
                        
                        className="btn btn-secondary"
                        onClick={() => navigate(-1) } style={{ textDecoration: 'none' }}
                      >
                        <i className="mdi mdi-arrow-left me-1" /> Voltar{" "}
                      </Link>
                    </Col>
                    <Col sm="6">
                      <div className="text-sm-end mt-2 mt-sm-0">
                        <button
                          className="btn btn-success" onClick={handleEnviarClick}
                        >
                          Enviar
                        </button>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddExperimentoConf;
