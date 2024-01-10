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
import Select2 from "react-select";
import classnames from "classnames"

//Imports
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from '../../components/Common/TableContainerNoFilter';
import Pagination from '../../components/Common/Pagination';

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";



const EcommerceCheckout = (props) => {
  const navigate = useNavigate();
  const { componenteId } = useParams();
  //meta title
  document.title="Componentes | Adicionar";

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRows2, setSelectedRows2] = useState([]);
  const [hasNotInputs, sethasNotInputs] = useState(true);

  const [hasNotInputs2, sethasNotInputs2] = useState(true);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [activeTab, setactiveTab] = useState("1")
  const [activeTabb, setActiveTabb] = useState("1");
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [options2, setOptions] = useState([]);
  const [optDisc, setOptDisc] = useState([]);
  const [optExp, setOptExp] = useState([]);
  const [inputHiddenName, setInputHiddenName] = useState('');
  const [inputHiddenId, setInputHiddenId] = useState(0);

  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [colorAlert, setcolorAlert] = useState('success');

  const [selectedGroup, setselectedGroup] = useState(null);
  const [optionGroup, setoptionGroup] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  function handleSelectGroup(selectedGroup) {
    setselectedGroup(selectedGroup);

    const getdisciplinas = async () => {
      console.log('craziii2')
      let userId = selectedGroup.value;
      console.log(userId)
      try {
        const response = await get(`/api/vinculos/mydisciplinasbyprof/${userId}?page=0&size=10`);
        console.log('unidade')
        console.log(response)
        console.log(options2)

        const extractedDisciplina = response.content.map(item => ({
          id: item.disciplinaId.id,
          nome: item.disciplinaId.nome,
        }));

        setOptDisc(extractedDisciplina)

       
      } catch (error) {
        console.log(error);
      }
    };

    validation.setValues(prevValues => ({
      ...prevValues,
      userId: selectedGroup.value,
    }));
    
    getdisciplinas();
  }

  function handleSelectDisciplines(e) {
    console.log('foi21')
    console.log(e.target.value)

    let disciplinaId = e.target.value;
    let userId = selectedGroup.value;
    
    const getExperimento = async (disciplinaId,userId) => {

      try {
        const response = await get(`/api/vinculos/mydisciplinas/experimentos/findbyprof/${disciplinaId}/${userId}?page=0&size=10`);
        console.log('dsa')
        console.log(response)


        const extractedDisciplina = response.content.map(item => ({
          id: item.experimentoId.id,
          nome: item.experimentoId.nome,
        }));

        setOptExp(extractedDisciplina)


       
      } catch (error) {
        console.log(error);
      }
    };

    validation.setValues(prevValues => ({
      ...prevValues,
      disciplinaId: disciplinaId,
    }));

    getExperimento(disciplinaId,userId)
  }

  function handleSelectExperimentos(e) {

    const getReservas = async (experimentoId) => {
    
      const response = await get(`/api/reservas/myreserva/buscar/${experimentoId}`, {
        params: {
          page: 0,
          size: 10,
        },
      });

    }

    validation.setValues(prevValues => ({
      ...prevValues,
      experimentoId: e.target.value,
    }));

    getReservas(e.target.value)

    setIsButtonDisabled(false)
  }

  const customStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',        // Change the color of the text
      fontSize: '16px',     // Change the font size
    }),
  };

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

  const columns2 = useMemo(
    () => [
      {
        Header: 'Seleção',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">

            {row.original.cpId ? ( // Check if componente exists
            <div>
              {selectedRows2.some((selectedRow) => selectedRow.cpId === row.original.cpId) === false && (
                <div className="d-inline-block mx-1"
                onClick={() => addSelection2(row.original.cpId, 
                  row.original.tpId,
                  row.original.cpQuantidade,
                  row.original.tpQuantidade,
                  row.original.especificacao,
                  row.original.nome,
                  row.original.valor
                  )}
                >
                  <i className="bx bx-checkbox" style={{ fontSize: '24px' }}></i>
                </div>
              )}

              {selectedRows2.some((selectedRow) => selectedRow.cpId === row.original.cpId) === true && (
                <div
                  className="d-inline-block mx-1"
                  onClick={() => removeSelection2(row.original.cpId)}
                >
                  <i className="bx bx-check-square" style={{ fontSize: '24px', color: '#556ee6' }}></i>
                </div>
              )}

            </div>
          ) : 
          <div className="d-inline-block mx-1">
              <i className="fas fa-border-style" style={{ fontSize: '21px' ,color: '#DC143C'}}></i>
          </div>
          }
            
          </div>
        ),
      },
      {
        Header: 'OrderId',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">
            {row.original.cpId ? (<div>
              {row.original.cpId}
            </div>):'Não disponivel'} 
          </div>
        ),
      },
      {
        Header: 'Q. pedida',
        accessor: 'tpQuantidade',
      },
      {
        Header: 'Nome',
        accessor: 'nome',
      },
      {
        Header: 'Valor',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">
            {row.original?.valor} 
          </div>
        ),
      },
      {
        Header: 'Especificacao',
        accessor: 'especificacao',
      },
  
    ],
    [selectedRows2]
  );

  const fetchProfs = async () => {
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

  const fetchUsers = async (page) => { 
    try {
      setLoading(true);
      const response = await get('/api/componentes/buscar/solicitado', {
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


  


  // Function to add a row ID to the selectedRows array
  const addSelection = (id, tipoComponenteId,nome,especificacao,valor,unidade,qtdDisponivel) => {
    setSelectedRows((prevSelectedRows) => [...prevSelectedRows, { id, tipoComponenteId,nome,
      especificacao,valor,unidade,qtdDisponivel }]);

      sethasNotInputs(false);
  };

    // Function to add a row ID to the selectedRows array
    const addSelection2 = (cpId, tpId, cpQuantidade, tpQuantidade, especificacao, nome, valor) => {
      setSelectedRows2(prevSelectedRows2 => [...prevSelectedRows2, 
        { cpId, tpId, cpQuantidade, tpQuantidade, especificacao, nome, valor }
      ]);
    
      sethasNotInputs(false);
    };

  // Function to remove a row ID from the selectedRows array
  const removeSelection = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.filter((row) => row.id !== id )
    );
  };

  const removeSelection2 = (cpId) => {
    setSelectedRows2((prevSelectedRows) =>
      prevSelectedRows.filter((row) => row.cpId !== cpId )
    );
  };
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
  
    initialValues: {
      userId: '',
      disciplinaId: '',
      experimentoId: '',
    },
    validationSchema: Yup.object({
      disciplinaId: Yup.mixed().required("Please select an option"),
      experimentoId: Yup.mixed().required("Please select an option"),
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
            nome: selectedGroup,
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
  /*
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
  */
  const handlePageChange = page => {
		fetchUsers(page-1);
	};
  
    useEffect(() => {
      fetchProfs();
      fetchUsers(0);
      fetchOptions();
     // carregaSeEdit(componenteId)
    }, []);

    useEffect(() => {
      console.log('Selected Rows:', selectedRows);
      sethasNotInputs(selectedRows.length === 0)
    }, [selectedRows]);

    useEffect(() => {
      console.log('Selected Rows:', selectedRows);
      sethasNotInputs2(selectedRows2.length === 0)
    }, [selectedRows2]);
    
    const getListofProfExp = async () => {
      
      const experimentoid = validation.values.experimentoId;

      try {
        setLoading(true);

        const response = await post(`/api/componentes/getlistaexperimento`,{
          experimentoid:  experimentoid
        });
  
        setData2(response)

        const filteredResponses = response.filter(resp => resp.cpId !== null);

        const newSelectedRows = filteredResponses.map(resp => ({
          cpId: resp.cpId,
          tpId: resp.tpId,
          cpQuantidade: resp.cpQuantidade,
          tpQuantidade: resp.tpQuantidade,
          especificacao: resp.especificacao,
          nome: resp.nome,
          valor: resp.valor
        }));
        
        setSelectedRows2(newSelectedRows);
        

        console.log(selectedRows2)
  
      } catch (error) {
        //setError(error);
        setLoading(false);
        console.log(error)
      }
    };
    
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
                                            Limpar formulário2
                                        </Button>
                                        {hasNotInputs ? (
                                          <Button color="primary" type="submit" disabled>
                                            Submeter formulário
                                          </Button>
                                          ) : (
                                            <Link to={`/solicitarAddConf`} state={{ selectedRows }}>
                                              <Button color="primary" type="submit">
                                                Submeter formulário
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
                                    <Label>Lista de componentes agrupados por experimento</Label>
                                  </div>

                                  <div className="mb-3">
                                    <Row >
                                      <Col lg={3} className="mb-3">
                                        <label htmlFor="name">Professor</label>
                                        <Select2
                                          value={selectedGroup}
                                          onChange={handleSelectGroup}
                                          options={optionGroup}
                                          className="select2-selection"
                                          isLoading={isLoading}
                                          styles={customStyles}
                                        />
                                      </Col>

                                      <Col lg={3} className="mb-3">
                                      <Label className="form-label">Disciplinas</Label>
                                          <Input
                                          type="select"
                                          name="disciplina"
                                          onChange={handleSelectDisciplines}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.disciplinaId || ""}
                                          invalid={validation.touched.disciplinaId && validation.errors.disciplinaId}
                                        >
                                          <option value="">Selecione</option>
                                          {optDisc.map((option) => (
                                          <option key={option.id} value={option.id}>
                                            {option.nome}
                                          </option>
                                        ))}
                                        </Input>
                                        {validation.touched.disciplinaId && validation.errors.disciplinaId && (
                                          <FormFeedback type="invalid">{validation.errors.disciplinaId}</FormFeedback>
                                        )}
                                      </Col>

                                      <Col lg={3} className="mb-3">
                                      <Label className="form-label">Experimentos</Label>
                                          <Input
                                          type="select"
                                          name="experimento"
                                          onChange={handleSelectExperimentos}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.experimentoId || ""}
                                          invalid={validation.touched.experimentoId && validation.errors.experimentoId}
                                        >
                                          <option value="">Selecione</option>
                                          {optExp.map((option) => (
                                          <option key={option.id} value={option.id}>
                                            {option.nome}
                                          </option>
                                        ))}
                                        </Input>
                                        {validation.touched.experimentoId && validation.errors.experimentoId && (
                                          <FormFeedback type="invalid">{validation.errors.experimentoId}</FormFeedback>
                                        )}
                                      </Col>


                                      <Col lg={3} className="align-self-center">
                                        <div className="d-grid">
                                          <input
                                            type="button"
                                            className="btn btn-primary"
                                            value="Procurar2"
                                            onClick={() => getListofProfExp()}
                                            style={{
                                              marginTop: '10px', // Adjust the value as needed
                                            }}
                                            disabled={isButtonDisabled}
                                          />
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  
                                  
                                </Form>

                                <div className="mb-2">
                                      <div className="mb-3">
                                        <TableContainer
                                          columns={columns2}
                                          data={data2}
                                          className="custom-header-css"
                                          handleInputSearch={handleInputSearch}
                                          onPageChange={handlePageChange}
                                        />
                                      </div>
                                      
                                      <div className="d-flex justify-content-end mt-3 ">
                                        <Button color="secondary" type="submit" className="me-2" onClick={handleClear}>
                                            Limpar formulário
                                        </Button>
                                        {hasNotInputs2 ? (
                                          <Button color="primary" type="submit" disabled>
                                            Submeter formulário2
                                          </Button>
                                          ) : (
                                            <Link to={`/solicitarAddConf`} state={{ selectedRows2 }}>
                                              <Button color="primary" type="submit">
                                                Submeter formulário2
                                              </Button>
                                            </Link>
                                        )}
                                      </div>
                                </div>
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
