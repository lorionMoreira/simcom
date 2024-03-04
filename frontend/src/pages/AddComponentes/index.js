import React, { useState, useMemo, useEffect   } from "react"
import { del, get, post, put } from "../../helpers/api_helper";
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Nav,
  NavItem,
  NavLink,
  FormFeedback, 
  Row,
  TabContent,
  TabPane,
  CardSubtitle,
  CardTitle
} from "reactstrap"

import classnames from "classnames"
import { Link } from "react-router-dom"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import TableContainer from '../../components/Common/TableContainerNoFilter';
import Pagination from '../../components/Common/Pagination';

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { exists } from "i18next";


const FormWizard = () => {
  const navigate = useNavigate();
  //meta title
  document.title="Form Wizard | Skote - React Admin & Dashboard Template";
  
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
              <i className="bx bx-checkbox" style={{ fontSize: '24px' }}></i>
            </a>
          </div>
        ),
      },
  
    ],
    []
  );

  const [activeTab, setactiveTab] = useState(1)
  const [activeTabb, setActiveTabb] = useState("1");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRows, setTotalRows] = useState(1);
  const [loading, setLoading] = useState(false);
  const [passedSteps, setPassedSteps] = useState([1])
  const [options2, setOptions] = useState([]);
  const [perPage, setPerPage] = useState(10);

  const [alertMsg, setAlertMsg] = useState('');
  const [colorAlert, setcolorAlert] = useState('success');
  const [alert, setAlert] = useState(false);

  const [inputHiddenName, setInputHiddenName] = useState('');
  const [inputHiddenId, setInputHiddenId] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  
  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab]
      if (tab >= 1 && tab <= 4) {
        setactiveTab(tab)
        setPassedSteps(modifiedSteps)
      }
    }
  }

  const toggleTabb = tab => {
    if (activeTabb !== tab) {
      setActiveTabb(tab);
    }
  };

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

  const handleBuscar = () => {
    navigate('/componentes/buscar');
    
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

  const handlePageChange = page => {
		fetchUsers(page-1);
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
      setactiveTab(2)

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

  useEffect(() => {
    fetchUsers(0);
    fetchOptions();
  }, []);

  const handleUnsetInput = async () => {

    setInputHiddenName('')
    setInputHiddenId(0)
    setIsButtonDisabled(true)

  }

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
      valor: Yup.string().required("Por favor, digite o valor do tipo de componente"),
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
        console.log(values.unidade);
        
        if(values.unidade === '') {
          const adimensionalItem = options2.find(item => item.nome === 'ADIMENSIONAL');
          if (adimensionalItem) {
            values.unidade = adimensionalItem.id;
          }
        }
        

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
          setactiveTab(2)
  
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
          //navigate('/componentes/buscar');
          setactiveTab(3)

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
          //navigate('/componentes/buscar');
          setactiveTab(3)

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

  const isNameValid = inputHiddenId > 0;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Componentes" breadcrumbItem="Novo Componente" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  
                  <div className="wizard clearfix">
                    <div className="steps clearfix">
                      <ul>
                        <NavItem
                          className={classnames({ current: activeTab === 1 })}
                        >
                          <NavLink
                            className={classnames({ current: activeTab === 1 })}
                            onClick={() => {
                              setactiveTab(1)
                            }}
                            disabled={!(passedSteps || []).includes(1)}
                          >
                            <span className="number">1.</span> Tipo de Componente
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={classnames({ current: activeTab === 2 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 2 })}
                            onClick={() => {
                              setactiveTab(2)
                            }}
                            disabled={!(passedSteps || []).includes(2)}
                          >
                            <span className="number">2.</span> Detalhamento do pacote
                          </NavLink>
                        </NavItem>

                        <NavItem
                          className={classnames({ current: activeTab === 3 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 3 })}
                            onClick={() => {
                              setactiveTab(4)
                            }}
                            disabled={!(passedSteps || []).includes(3)}
                          >
                            <span className="number">3.</span> Confirmação
                          </NavLink>
                        </NavItem>
                      </ul>
                    </div>
                    <div className="content clearfix">
                      <TabContent activeTab={activeTab} className="body">
                        <TabPane tabId={1}>
                        <div>
                          <CardTitle>Tipo de Componente</CardTitle>
                          <CardSubtitle className={`font-14 text-muted mb-3 `}>
                            Selecione o tipo de componente em uma lista ou crie um novo tipo de componente primeiro.
                          </CardSubtitle>
                            <div className="crypto-buy-sell-nav">
                              <Nav tabs className="nav-tabs-custom" role="tablist">
                                <NavItem>
                                  <NavLink
                                    className={classnames({
                                      active: activeTabb === "1",
                                    })}
                                    onClick={() => {
                                      toggleTabb("1");
                                    }}
                                  >
                                    De Uma Lista
                                  </NavLink>
                                </NavItem>
                                <NavItem>
                                  <NavLink
                                    className={classnames({
                                      active: activeTabb === "2",
                                    })}
                                    onClick={() => {
                                      toggleTabb("2");
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
                                          <option value="0">Não</option>
                                        </Input>
                                        {validation.touched.tipo && validation.errors.tipo && (
                                          <FormFeedback type="invalid">{validation.errors.tipo}</FormFeedback>
                                        )}
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                      <button type="submit" className="btn btn-primary w-md">
                                        Salvar
                                      </button>
                                    </div>
                                  </Form>
                                </TabPane>
                              </TabContent>
                            </div>
                        </div>
                      
                        </TabPane>
                        <TabPane tabId={2}>
                          <div>
                            <CardTitle>Detalhamento do pacote</CardTitle>
                            <p className="card-title-desc">
                              Preencha o formulário abaixo para a configuração do pacote de armazenamento do componente.
                            </p>


                            <div className="p-4 border">
                            <Form
                                className="form-horizontal"
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  validationf.handleSubmit();
                                  return false;
                                }}
                            >


                                <div className="mb-3">
                                  <Row>
                                    <Col md={10}>
                                      <Label className="form-label">Nome do tipo de componente *</Label>
                                      <div className="input-group">
                                        <Input
                                          name="nome"
                                          className="form-control"
                                          placeholder="Digite o nome do Tipo de Componente"
                                          type="nome"
                                          onChange={validationf.handleChange}
                                          disabled
                                          value={inputHiddenName || ""}
                                          valid={isNameValid} 
                                          invalid={!isNameValid}
                                        />
                                        <button className="btn btn-primary" onClick={handleUnsetInput}  disabled={isButtonDisabled} 
                                        type="button" id="inputGroupFileAddon04">
                                          <i className="bx bx-x" />
                                        </button>
                                      </div>
                                      {!isNameValid ? (
                                        <FormFeedback type="invalid">Selecione o tipo de componente no passo - 1 </FormFeedback>
                                      ) : null}
                                    </Col>
                                    <Col md={2}>
                                      <Label className="form-label">Data*</Label>
                                      <Input
                                        name="fornecedor_data"
                                        className="form-control"
                                        placeholder="Digite a data do fornecimento do lote de componentes"
                                        type="date"
                                        onChange={validationf.handleChange}
                                        onBlur={validationf.handleBlur}
                                        value={validationf.values.fornecedor_data || ""}
                                        invalid={
                                          validationf.touched.fornecedor_data && validationf.errors.fornecedor_data ? true : false
                                        }
                                      />
                                      {validationf.touched.fornecedor_data && validationf.errors.fornecedor_data ? (
                                        <FormFeedback type="invalid">{validationf.errors.fornecedor_data}</FormFeedback>
                                      ) : null}
                                    </Col>

                                  </Row>
                                </div>
                                <div className="mb-3">
                                  <Row>
                                    <Col md={6}>
                                      <Label className="form-label">fornecedor*</Label>
                                      <Input
                                        name="fornecedor"
                                        className="form-control"
                                        placeholder="Digite o fornecedor do tipo de Componente"
                                        type="text"
                                        onChange={validationf.handleChange}
                                        onBlur={validationf.handleBlur}
                                        value={validationf.values.fornecedor || ""}
                                        invalid={
                                          validationf.touched.fornecedor && validationf.errors.fornecedor ? true : false
                                        }
                                      />
                                      {validationf.touched.fornecedor && validationf.errors.fornecedor ? (
                                        <FormFeedback type="invalid">{validationf.errors.fornecedor}</FormFeedback>
                                      ) : null}
                                    </Col>
                                    <Col md={3}>
                                      <Label className="form-label">quantidade*</Label>
                                      <Input
                                        name="quantidade"
                                        className="form-control"
                                        placeholder="Digite o quantidade do tipo de Componente"
                                        type="number"
                                        onChange={validationf.handleChange}
                                        onBlur={validationf.handleBlur}
                                        value={validationf.values.quantidade || ""}
                                        invalid={
                                          validationf.touched.quantidade && validationf.errors.quantidade ? true : false
                                        }
                                      />
                                      {validationf.touched.quantidade && validationf.errors.quantidade ? (
                                        <FormFeedback type="invalid">{validationf.errors.quantidade}</FormFeedback>
                                      ) : null}
                                    </Col>
                                    <Col md={3}>
                                      <Label className="form-label">Validade</Label>
                                      <Input
                                        name="validade"
                                        className="form-control"
                                        placeholder="Digite a data de validade"
                                        type="date"
                                        onChange={validationf.handleChange}
                                        onBlur={validationf.handleBlur}
                                        value={validationf.values.validade || ""}
                                        invalid={
                                          validationf.touched.validade && validationf.errors.validade ? true : false
                                        }
                                      />
                                      {validationf.touched.validade && validationf.errors.validade ? (
                                        <FormFeedback type="invalid">{validationf.errors.validade}</FormFeedback>
                                      ) : null}
                                    </Col>
                                  </Row>
                                </div>

                                <div className="mb-3">
                                  <Row>
                                    <Col md={12}>
                                      <Label className="form-label">observacao</Label>
                                      <Input
                                        name="observacao"
                                        className="form-control"
                                        placeholder="Digite a data de observacao"
                                        type="text"
                                        onChange={validationf.handleChange}
                                        onBlur={validationf.handleBlur}
                                        value={validationf.values.observacao || ""}
                                        invalid={
                                          validationf.touched.observacao && validationf.errors.observacao ? true : false
                                        }
                                      />
                                      {validationf.touched.observacao && validationf.errors.observacao ? (
                                        <FormFeedback type="invalid">{validationf.errors.observacao}</FormFeedback>
                                      ) : null}
                                    </Col>

                                  </Row>
                                </div>
                                <div className="d-flex justify-content-end">
                                  <button type="submit" className="btn btn-primary w-md">
                                    Salvar
                                  </button>
                                </div>
                              </Form>
                            </div>
                          </div>
                        </TabPane>
                        <TabPane tabId={3}>
                          <div className="row justify-content-center">
                            <Col lg="6">
                              <div className="text-center">
                                <div className="mb-4">
                                  <i className="mdi mdi-check-circle-outline text-success display-4" />
                                </div>
                                <div>
                                  <h5>Componente Salvo!</h5>
                                  <p className="text-muted">
                                    Clique no botão abaixo para  voltar a tela de busca de componentes
                                  </p>
                                  <Button color="primary" type="submit" className="me-2" onClick={handleBuscar}>
                                    Menu Buscar
                                  </Button>
                                </div>
                              </div>
                            </Col>
                          </div>
                        </TabPane>
                      </TabContent>
                    </div>


                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default FormWizard
