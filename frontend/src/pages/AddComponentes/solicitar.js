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

//Import Images
import img1 from "../../assets/images/product/img-1.png"
import img7 from "../../assets/images/product/img-7.png"




const EcommerceCheckout = (props) => {
  const navigate = useNavigate();
  const { componenteId } = useParams();
  //meta title
  document.title="Componentes | Adicionar";

  const [selectedRows, setSelectedRows] = useState([]);
  const [hasNotInputs, sethasNotInputs] = useState(true);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
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

  const columns = useMemo(
    () => [
      {
        Header: 'Seleção',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">

            {row.original ? ( // Check if componente exists
            <div>
              {selectedRows.some((selectedRow) => selectedRow.id === row.original.id) === false && (
                <div
                  className="d-inline-block mx-1"
                  onClick={() => addSelection(row.original.id, 
                    row.original.tipoComponente.id,
                    row.original.tipoComponente.nome,
                    row.original.tipoComponente.especificacao,
                    row.original.tipoComponente.valor,
                    row.original.tipoComponente.unidadeId.nome,
                    row.original.quantidade
                    )}
                >
                  <i className="bx bx-checkbox" style={{ fontSize: '24px' }}></i>
                </div>
              )}

              {selectedRows.some((selectedRow) => selectedRow.id === row.original.id) === true && (
                <div
                  className="d-inline-block mx-1"
                  onClick={() => removeSelection(row.original.id)}
                >
                  <i className="bx bx-check-square" style={{ fontSize: '23px', color: '#556ee6' }}></i>
                </div>
              )}

            </div>
          ) : null}
            
          </div>
        ),
      },
      {
        Header: 'OrderId',
        accessor: 'id',
      },
      {
        Header: 'Q. disponível',
        accessor: 'quantidade',
      },
      {
        Header: 'Nome',
        accessor: 'tipoComponente.nome',
      },
      {
        Header: 'Valor',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">
            {row.original?.tipoComponente.valor} {row.original?.tipoComponente.unidadeId.nome}
          </div>
        ),
      },
      {
        Header: 'Especificacao',
        accessor: 'tipoComponente.especificacao',
      },
  
    ],
    [selectedRows]
  );



  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await get('/api/componentes/buscar', {
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

  const handleClear = () => {
    
    setSelectedRows([]);
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
      setIsButtonDisabled(false)
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
  
  const handleUnsetInput = async () => {

    setInputHiddenName('')
    setInputHiddenId(0)
    setIsButtonDisabled(true)

  }

  // Function to add a row ID to the selectedRows array
  const addSelection = (id, tipoComponenteId,nome,especificacao,valor,unidade,qtdDisponivel) => {
    setSelectedRows((prevSelectedRows) => [...prevSelectedRows, { id, tipoComponenteId,nome,
      especificacao,valor,unidade,qtdDisponivel }]);

      sethasNotInputs(false);
  };

  // Function to remove a row ID from the selectedRows array
  const removeSelection = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.filter((row) => row.id !== id )
    );
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

          setInputHiddenName(response.nome)
          setInputHiddenId(response.id)
          setactiveTab("2")
  
        } catch (error) {
          console.log(error);
      
        }
      };
    
      handleSubmission();
  }
  });

  const validationf = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
  
    initialValues: {
      id: '',
      fornecedor_data: '',
      fornecedor: '',
      quantidade: '',
      validade: '',
      observacao: ''
    },
    validationSchema: Yup.object({
      fornecedor_data: Yup.string().required("Por favor, digite a especificacao do tipo de componente"),
      fornecedor: Yup.string().required("Por favor, digite o valor do tipo de componente"),
      quantidade: Yup.number().required("Por favor, digite a unidade do tipo de componente"),
      validade: Yup.string().required("Por favor, digite a especificacao do tipo de componente"),
      //observacao: Yup.string().required("Por favor, digite se o tipo de componente é consumível"),
    }),
    onSubmit: (values) => {
      const handleSubmission2 = async () => {

        const formattedValues = {};
        formattedValues.fornecedorData = formatDate2(values.fornecedor_data);
        formattedValues.fornecedor = values.fornecedor;
        formattedValues.quantidade = values.quantidade;
        formattedValues.validade = formatDate2(values.validade);
        formattedValues.observacao = values.observacao;
        formattedValues.tipoComponenteId = inputHiddenId;
        
        try {
          const response = await post('/api/componentes/salvar',formattedValues);
          console.log(response)

          //history.push('/new-page');
          //window.location = '/componentes/buscar'
          navigate('/componentes/buscar');
        //  console.log(props.router.navigate('/componentes/buscar'))
        } catch (error) {
          console.log(error);
          
        }
      };

      const handleUpdate = async (id) => {

        const formattedValues = {};
        formattedValues.fornecedorData = formatDate2(values.fornecedor_data);
        formattedValues.fornecedor = values.fornecedor;
        formattedValues.quantidade = values.quantidade;
        formattedValues.validade = formatDate2(values.validade);
        formattedValues.observacao = values.observacao;
        formattedValues.tipoComponenteId = inputHiddenId;
        
        try {
          const response = await put(`/componentes/update/${id}`,formattedValues);
          console.log(response)

          //history.push('/new-page');
          //window.location = '/componentes/buscar'
          navigate('/componentes/buscar');
        //  console.log(props.router.navigate('/componentes/buscar'))
        } catch (error) {
          console.log(error);
          
        }
      };

    if(inputHiddenId != 0 && values.id){
      handleUpdate(values.id);
    }else{
      handleSubmission2();
    }
      
  }
  });

  function formatDate2(dateString) {

    const dateStr = dateString;
    const parts = dateStr.split("-"); // Split the string by "-"
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`; // Rearrange the parts in "dd/MM/yyyy" format
  
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

  function formatDateontrary(dateString) {

    const dateStr = dateString;

    const parts = dateStr.split("/"); // Split the string by "-"

    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Rearrange the parts in "dd/MM/yyyy" format
   // const formattedDate = `${parts[0]}-${parts[1]}-${parts[2]}`; // Rearrange the parts in "dd/MM/yyyy" format
    return formattedDate;
  }

  function formatDateontraryEst(dateString) {

    const dateStr = dateString;

    const parts = dateStr.split("-"); // Split the string by "-"

    const day = parts[2].substring(0, 2);

    const formattedDate = `${parts[0]}-${parts[1]}-${day}`; 
    
    return formattedDate;
  }

  const handlePageChange = page => {
		fetchUsers(page-1);
	};
  
    useEffect(() => {
      fetchUsers(0);
      fetchOptions();
     // carregaSeEdit(componenteId)
    }, []);

    useEffect(() => {
      console.log('Selected Rows:', selectedRows);
      sethasNotInputs(selectedRows.length === 0)
    }, [selectedRows]);
    /*
    const carregaSeEdit = async (componenteId) => {
      

      if(componenteId == 0){
        return;
      }
      
      try {
        setLoading(true);
        setCurrentPage(0)
        const response = await get(`/api/componentes/findbyid/${componenteId}`);
  
        console.log('asd');
        console.log(response);
        console.log(formatDateontraryEst(response.validade))

        validation.setValues({
          id: response.tipoComponente.id,
          nome: response.tipoComponente.nome, 
          tipo: response.tipoComponente.tipo,
          especificacao: response.tipoComponente.especificacao,
          valor: response.tipoComponente.valor,
          validade:formatDateontrary(response.tipoComponente.validade) ,
          unidade: response.tipoComponente.unidadeId.id 
        });

        validationf.setValues({
          id: response.id,
          fornecedor_data:  formatDateontraryEst(response.fornecedorData),
          fornecedor: response.fornecedor,
          quantidade: response.quantidade,
          validade: formatDateontraryEst(response.validade),
          observacao: response.obs,
        });

        setInputHiddenName(response.tipoComponente.nome)
        setInputHiddenId(response.tipoComponente.id)
        //setactiveTab("2") //aqui
        setActiveTabb("2")

  
      } catch (error) {
        //setError(error);
        setLoading(false);
        console.log(error)
      }
    };
    */
    const isNameValid = inputHiddenId > 0;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Componentes" breadcrumbItem="Adicionar" />

          <div className="checkout-tabs">
            <Row>

              <Col lg="12" sm="12">
                <Card>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <div>
                        <CardTitle>Fornecimento de Componentes2</CardTitle>
                        <CardSubtitle className={`font-14 text-muted mb-3 `}>
                          Selecione o ativo que deseja fornecer a um cliente ou selecione um conjunto de ativos em uma lista.
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
                                  Fornecer ativo de forma individual
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink
                                  className={classnames({
                                    active: activeTabb === "2",
                                  })}
                                  onClick={() => {
                                    toggleTab("2");
                                  }}
                                >
                                  Fornecer ativo em conjunto a partir de uma lista
                                </NavLink>
                              </NavItem>
                            </Nav>
                            <TabContent
                              activeTab={activeTabb}
                              className="crypto-buy-sell-nav-content p-4"
                            >
                              <TabPane tabId="1" id="buy">
                                
                                <div className="mb-2">
                                      <div className="mb-3">
                                        <TableContainer
                                          columns={columns}
                                          data={data}
                                          className="custom-header-css"
                                          handleInputSearch={handleInputSearch}
                                          onPageChange={handlePageChange}
                                        />
                                        <Pagination  key={loading} currentPage={currentPage+1}
                                        totalPages={totalRows} onPageChange={handlePageChange} />
                                      </div>
                                      
                                      <div className="d-flex justify-content-end mt-3 ">
                                        <Button color="secondary" type="submit" className="me-2" onClick={handleClear}>
                                            Limpar formulário
                                        </Button>
                                        {hasNotInputs ? (
                                          <Button color="primary" type="submit" disabled>
                                            Submeter formulário2
                                          </Button>
                                          ) : (
                                            <Link to={`/solicitarAddConf`} state={{ selectedRows }}>
                                          <Button color="primary" type="submit">
                                            Submeter formulário3
                                          </Button>
                                            </Link>
                                        )}
                                      </div>
                                </div>

                              </TabPane>

                              <TabPane tabId="2">
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
                                          type="number"
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
                                        <option value="0">Não</option>
                                      </Input>
                                      {validation.touched.tipo && validation.errors.tipo && (
                                        <FormFeedback type="invalid">{validation.errors.tipo}</FormFeedback>
                                      )}
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="d-flex justify-content-end">
                                  {hasNotInputs ? (
                                    <Button color="primary" type="submit" disabled>
                                      Submeter formulário2
                                    </Button>
                                    ) : (
                                      <Link to={`/solicitarAddConf`} state={{ selectedRows }}>
                                    <Button color="primary" type="submit">
                                      Submeter formulário3
                                    </Button>
                                      </Link>
                                  )}
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

export default EcommerceCheckout
