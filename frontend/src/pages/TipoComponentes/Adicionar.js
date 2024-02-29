import React, {  useState,useMemo, useEffect  } from "react";
import { del, get, post, put } from "../../helpers/api_helper";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Nav,
  Alert,
  Select,
  NavItem,
  NavLink,
  Button,
  CardSubtitle,
  TabContent,
  TabPane,
  FormFeedback, 
  Card,
  Form,
  FormGroup,
  Label,
  CardBody,
  CardTitle
} from "reactstrap"
//import Select from "react-select"
import { Link } from "react-router-dom"

import classnames from "classnames"

//Imports
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from '../../components/Common/TableContainerNoFilter';
import Pagination from '../../components/Common/Pagination';

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";




const Adicionar = (props) => {
  const navigate = useNavigate();

  const { tipoComponenteId } = useParams();

  //meta title
  document.title="Componentes | Adicionar";

  const columns = useMemo(
    () => [
      {
        Header: 'OrderId',
        accessor: 'id',
      },
      {
        Header: 'Nome',
        accessor: 'nome',
      },
      {
        Header: 'Valor',
        accessor: 'valor',
      },
      {
        Header: 'Unidade',
        accessor: 'unidadeId.nome',
      },
      {
        Header: 'Especificacao',
        accessor: 'especificacao',
      },
      {
        Header: 'Ações',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">

            <a
              className="d-inline-block mx-2"
              onClick={() => handleAction(row.original.id)}
            >
            <i className="bx bx-checkbox-checked" style={{ fontSize: '24px' }}></i>
            </a>
          </div>
        ),
      },
  
    ],
    []
  );

  
  const [activeTab, setactiveTab] = useState("1")
  const [activeTabb, setActiveTabb] = useState("1");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [options2, setOptions] = useState([]);

  const [inputHiddenName, setInputHiddenName] = useState('');
  const [inputHiddenId, setInputHiddenId] = useState(0);

  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [colorAlert, setcolorAlert] = useState('success');

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await get('/api/tipocomponente/buscar', {
        params: {
          page: page,
          size: perPage,
        },
      });
      console.log("response")
      console.log(response)
      setData(response.content);
      setTotalRows(response.totalPages)
      setLoading(false);
      //setPaginationKey(Date.now()); 
      setCurrentPage(response.number)
     
    } catch (error) {
      //setError(error);
      setLoading(false);
      console.log(error)
    }
  };

  const toggleTab = tab => {
    if (activeTabb !== tab) {
      setActiveTabb(tab);
    }
  };

  useEffect(() => {
    carregaSeEdit(tipoComponenteId)
  }, []);

  const carregaSeEdit = async (tipoComponenteId) => {
    if(tipoComponenteId == 0){
      return;
    }

    try {
      setLoading(true);
      setCurrentPage(0)
      const response = await get(`/api/tipocomponente/findbyid/${tipoComponenteId}`);

      console.log('asd');
      console.log(formatDateontrary(response.validade))
      validation.setValues({
        id: response.id,
        nome: response.nome, 
        tipo: response.tipo,
        especificacao: response.especificacao,
        valor: response.valor,
        validade:formatDateontrary(response.validade) ,
        unidade: response.unidadeId.id 
      });


    } catch (error) {
      //setError(error);
      setLoading(false);
      console.log(error)
    }
  };

  const handleInputSearch = async (buscaString) => {
    try {
      setLoading(true);
      setCurrentPage(0)
      const response = await post('/api/tipocomponente/buscar',
      {
        searchRequest: buscaString
      },
       {
        params: {
          page: 0,
          size: perPage,
        },
      });
      console.log("response")
      console.log(response)
      setData(response.content);
  
  
     let total = response.totalPages == 0 ? 1 : response.totalPages
      setTotalRows(total)
      setLoading(false);
      //setPaginationKey(Date.now()); 
      setCurrentPage(response.number)
    } catch (error) {
      //setError(error);
      setLoading(false);
      console.log(error)
    }
  };

  const handleAction = async (id) => {
    // Function for handling remove action

    try {
      setLoading(true);
      const response = await get(`/api/tipocomponente/findbyid/${id}`);
      console.log('aqui')
      console.log(response)
      /*
      setAlert(true);
      setAlertMsg('Disciplina Apagada com sucesso');
      setcolorAlert('success');
      */
      setInputHiddenName(response.nome)
      setInputHiddenId(response.id)

      setactiveTab("2")

      //fetchUsers(currentPage);
  
    } catch (error) {
      //setError(error);
      setLoading(false);
      setAlert(true);
      setAlertMsg('Error ao apagar a disciplina');
      setcolorAlert('danger');
      console.log(error);
    }
  
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
  
    initialValues: {
      id: '',
      nome: '',
      especificacao: '',
      valor: '',
      unidade: '',
      validade: '',
      tipo: ''
    },
    validationSchema: Yup.object({
      nome: Yup.string().required("Por favor, digite o nome do tipo de componente"),
      especificacao: Yup.string().required("Por favor, digite a especificacao do tipo de componente"),
      valor: Yup.number().required("Por favor, digite o valor do tipo de componente"),
      unidade: Yup.string().required("Por favor, digite a unidade do tipo de componente"),
      validade: Yup.date().required("Por favor, digite a validade do componente"),
      tipo: Yup.string().required("Por favor, digite se o tipo de componente é consumível"),
    }),
    onSubmit: (values) => {
      const handleSubmission = async () => {
        /*
        const dateStr = "2023-06-29";
        const parts = dateStr.split("-"); // Split the string by "-"
        const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`; // Rearrange the parts in "dd/MM/yyyy" format
        */

        try {
          const response = await post('/api/tipocomponente/salvar', {
            nome: values.nome,
            especificacao: values.especificacao,
            valor: values.valor,
            unidadeId: values.unidade,
            validade: formatDate2(values.validade) ,
            tipo: values.tipo
          });
          console.log(response)

          setAlert(true);
          setAlertMsg('Componente adicionado com sucesso!');
          setcolorAlert('success');

          setTimeout(() => {
            navigate('/tipocomponente/buscar');
          }, 2000);

        } catch (error) {
          console.log(error);
      
        }
      };

      const handleUpdate = async (id) => {
        // Function for handling edit action
        console.log(`Edit clicked for id ${id}`);
    
        try {
          const response = await put(`/api/tipocomponente/update/${id}`, {
            nome: values.nome,
            especificacao: values.especificacao,
            valor: values.valor,
            unidadeId: values.unidade,
            validade: formatDate2(values.validade) ,
            tipo: values.tipo
          });
    
          setAlert(true);
          setAlertMsg('Disciplina atualizada com sucesso!');
          setcolorAlert('success');
          

          setTimeout(() => {
            navigate('/tipocomponente/buscar');
          }, 2000);
          
    
        } catch (error) {
          console.log(error);
          setShowBad(true);
        }
    
      };
    
      if(values.id){
        handleUpdate(values.id);
      }else{
        handleSubmission();
      }
  }
  });



  function formatDate2(dateString) {

    const dateStr = dateString;
    const parts = dateStr.split("-"); // Split the string by "-"
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`; // Rearrange the parts in "dd/MM/yyyy" format
  
    return formattedDate;
  }

  function formatDateontrary(dateString) {

    const dateStr = dateString;
    const parts = dateStr.split("/"); // Split the string by "-"
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Rearrange the parts in "dd/MM/yyyy" format
   // const formattedDate = `${parts[0]}-${parts[1]}-${parts[2]}`; // Rearrange the parts in "dd/MM/yyyy" format
    return formattedDate;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    return `${padZero(day)}/${padZero(month)}/${year}`;
  }
  
  // Helper function to add leading zeros to a number if needed
  function padZero(num) {
    return num.toString().padStart(2, '0');
  }
  const fetchOptions = async () => {
    console.log('craziii')
    try {
      const response = await get('/api/unidade/all');
      console.log('unidade')
      console.log(response)
      setOptions(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = page => {
		fetchUsers(page-1);
	};
  
    useEffect(() => {
      fetchUsers(0);
      fetchOptions();
    }, []);
    
    const isNameValid = inputHiddenId > 0;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Componentes" breadcrumbItem="Adicionar" />

          <div className="checkout-tabs">
            <Row>
              <Col lg="2" sm="3">
                <Nav className="flex-column" pills>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => {
                        setactiveTab("1")
                      }}
                    >
                      <i className="fas fa-tools d-block check-nav-icon mt-4 mb-2" />
                      <p className="fw-bold mb-4">Tipo de Componente</p>
                    </NavLink>
                  </NavItem>

                </Nav>
              </Col>
              <Col lg="10" sm="9">
                <Card>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <div>
                        <CardTitle>Adicionar Componente </CardTitle>
                        <CardSubtitle className={`font-14 text-muted mb-3 `}>
                          Selecione o tipo de componente em uma lista ou crie um novo tipo de componente primeiro
                        </CardSubtitle>
                          <div className="crypto-buy-sell-nav">
                            <Nav tabs className="nav-tabs-custom" role="tablist">
                              <NavItem>
                                <NavLink
                                  className={classnames({
                                    active: activeTabb === "1",
                                  })}
                                  onClick={() => {
                                    toggleTab("1");
                                  }}
                                >
                                  Cadastrar novo tipo de componente
                                </NavLink>
                              </NavItem>

                            </Nav>
                              <TabContent
                                activeTab={activeTabb}
                                className="crypto-buy-sell-nav-content p-4"
                              >

                              <TabPane tabId="1">
                                <Form
                                    className="form-horizontal"
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      validation.handleSubmit();
                                      return false;
                                    }}
                                >
                                  <div className="mb-2">
                                    <Label>Novo Tipo de Componente</Label>
                                  </div>

                                  <div className="mb-3">
                                    <Row>
                                      <Col md={6}>
                                        <Label className="form-label">Nome*</Label>
                                        <Input
                                          name="nome"
                                          className="form-control"
                                          placeholder="Digite o nome do Tipo de Componente"
                                          type="nome"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.nome || ""}
                                          invalid={
                                            validation.touched.nome && validation.errors.nome ? true : false
                                          }
                                        />
                                        {validation.touched.nome && validation.errors.nome ? (
                                          <FormFeedback type="invalid">{validation.errors.nome}</FormFeedback>
                                        ) : null}
                                      </Col>
                                      <Col md={6}>
                                        <Label className="form-label">especificacao*</Label>
                                        <Input
                                          name="especificacao"
                                          className="form-control"
                                          placeholder="Digite a especificação do tipo de Componente"
                                          type="text"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.especificacao || ""}
                                          invalid={
                                            validation.touched.especificacao && validation.errors.especificacao ? true : false
                                          }
                                        />
                                        {validation.touched.especificacao && validation.errors.especificacao ? (
                                          <FormFeedback type="invalid">{validation.errors.especificacao}</FormFeedback>
                                        ) : null}
                                      </Col>

                                    </Row>
                                  </div>
                                  <div className="mb-3">
                                    <Row>
                                      <Col md={6}>
                                        <Label className="form-label">Valor*</Label>
                                        <Input
                                          name="valor"
                                          className="form-control"
                                          placeholder="Digite o valor do tipo de Componente"
                                          type="text"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.valor || ""}
                                          invalid={
                                            validation.touched.valor && validation.errors.valor ? true : false
                                          }
                                        />
                                        {validation.touched.valor && validation.errors.valor ? (
                                          <FormFeedback type="invalid">{validation.errors.valor}</FormFeedback>
                                        ) : null}
                                      </Col>
                                      <Col md={6}>
                                        <Label className="form-label">Unidade</Label>
                                        <Input
                                        type="select"
                                        name="unidade"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.unidade || ""}
                                        invalid={validation.touched.unidade && validation.errors.unidade}
                                      >
                                        <option value="">Selecione</option>
                                        {options2.map((option) => (
                                        <option key={option.id} value={option.id}>
                                          {option.nome}
                                        </option>
                                      ))}
                                      </Input>
                                      {validation.touched.unidade && validation.errors.unidade && (
                                        <FormFeedback type="invalid">{validation.errors.unidade}</FormFeedback>
                                      )}
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-3">
                                    <Row>
                                      <Col md={6}>
                                        <Label className="form-label">Validade</Label>
                                        <Input
                                          name="validade"
                                          className="form-control"
                                          placeholder="Digite a data de validade"
                                          type="date"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.validade || ""}
                                          invalid={
                                            validation.touched.validade && validation.errors.validade ? true : false
                                          }
                                        />
                                        {validation.touched.validade && validation.errors.validade ? (
                                          <FormFeedback type="invalid">{validation.errors.validade}</FormFeedback>
                                        ) : null}
                                      </Col>
                                      <Col md={6}>
                                        <Label className="form-label">consumível</Label>
                                        <Input
                                        type="select"
                                        name="tipo"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.tipo || ""}
                                        invalid={validation.touched.tipo && validation.errors.tipo}
                                      >
                                        <option value="">Selecione</option>
                                        <option value="1">Sim</option>
                                        <option value="2">Não</option>
                                      </Input>
                                      {validation.touched.tipo && validation.errors.tipo && (
                                        <FormFeedback type="invalid">{validation.errors.tipo}</FormFeedback>
                                      )}
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary w-md">
                                      Submit
                                    </button>
                                  </div>
                                </Form>
                              </TabPane>
                            </TabContent>
                          </div>
                        </div>
                      </TabPane>

                    </TabContent>
                  </CardBody>
                </Card>

              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Adicionar
