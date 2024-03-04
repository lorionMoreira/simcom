import React, {  useState,useMemo, useEffect  } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./style.module.css";
import {
  Button,
  Container,
  Card,
  Alert,
  Col,
  Collapse,
  CardBody,
  CardTitle,
  CardSubtitle,
  UncontrolledAlert,  
  Form,
  Input,
  FormFeedback, 
  Label 
} from "reactstrap";
//Import Breadcrumb
import { del, get, post, put } from "../../helpers/api_helper";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from '../../components/Common/TableContainerNoFilter';
import Pagination from '../../components/Common/Pagination';
import {useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//i18n
import { withTranslation } from "react-i18next";
const UserProfileExperimentoAdd = props => {

  const { demoData } = useSelector(state => ({
    demoData: state.Login.demoData,
  }));
  
  let loggedUserId = demoData.data?.id ;


  const navigate = useNavigate();
  //const { disciplinaId } = useParams();

  const columns = useMemo(
    () => [

      {
        Header: 'Nome',
        accessor: 'experimentoId.nome',
      },
      {
        Header: 'Disciplina',
        accessor: 'disciplinaId.nome',
      },
      {
        Header: 'Observações',
        accessor: 'experimentoId.obs',
      },
      {
        Header: 'Ações',
        Cell: ({ row }) => (
          <>
          {row.original?.experimentoId?.id && (
          <div className="d-flex justify-content-center">


            <Link to={`/experimentoadd/${row.original?.experimentoId?.id}`} className="d-inline-block mx-2">
              <i className="bx bx-add-to-queue" style={{ fontSize: '24px', color: '#556ee6'  }}></i>
           </Link> 

            <a
              className="d-inline-block "
              onClick={() => handleEdit(row.original?.experimentoId?.id,row.original?.disciplinaId?.id,loggedUserId)}//experimentoId
              title="Editar experimento"
            >
              <i className="bx bx-edit-alt" style={{ fontSize: '24px', color: '#556ee6'  }}></i>
            </a>

            <a
              className="d-inline-block mx-2"
              onClick={() => handleRemove(row.original?.experimentoId?.id)}//experimentoId
              title="Apagar experimento"
            >
              <i className="bx bx-trash-alt" style={{ fontSize: '24px', color: '#DC143C'  }}></i>
            </a>
            
          </div>
          )}
          </>
        ),
      },
    ],
    [loggedUserId]
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginationKey, setPaginationKey] = useState(Date.now());
  //const [stableUserId, setStableUserId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [disciplinas, setDisciplinas] = useState([]);


  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [colorAlert, setcolorAlert] = useState('success');

  const [col5, setcol5] = useState(true);


  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: '',
      nome: '',
      selectOption: '',
      obs: ''
    },
    validationSchema: Yup.object({
      nome: Yup.string().required("Por favor, digite o nome da disciplina"),
      selectOption: Yup.string().required("Please select an option")
    }),
    onSubmit: (values) => {
      // table experimento
      const handleSubmission = async () => {
        setLoading(true); 
        try {
          const response = await post(`/api/experimento/salvar/${values.selectOption}`, {
            nome: values.nome.trimStart(),
            obs: values.obs.trimStart()
          });
          
          setAlert(true);
          setAlertMsg('Disciplina salva com sucesso!');
          setcolorAlert('success');
          fetchUsers(currentPage);

          validation.setValues({
            id: '',
            nome: ' ' ,
            obs: ' '
          });

          setIsEditing(false);
          setLoading(false);
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        } catch (error) {
          console.log(error);
          setShowBad(true);
          setLoading(false);
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }
      };
      //table experimento
      const handleUpdate = async (experimentoId) => {
        // Function for handling edit action
        console.log(`Edit clicked for experimentoId ${experimentoId}`);
        setLoading(true);
        try {
          console.log(values)
          const response = await put(`/api/experimento/update/${experimentoId}`, {
            id: values.id,
            nome: values.nome,
            obs: values.obs
          });
    
          setAlert(true);
          setAlertMsg('Experimento atualizado com sucesso!');
          setcolorAlert('success');
          
          
          fetchUsers(currentPage);

          validation.setValues({
            id: '',
            nome: ' ' 
          });
          
          setIsEditing(false);
          setLoading(false);
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        } catch (error) {
          console.log(error);
          setShowBad(true);
          setLoading(false);
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }
    
      };
    
      if(values.id){
        handleUpdate(values.id);
      }else{
        handleSubmission();
      }
      

  }
  });
  // fetch users
  const fetchUsers = async (page) => {
    setLoading(true); 
    try {
      setLoading(true);
      const response = await get('/api/vinculos/mydisciplinas/experimentos/findexp', {
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

  const fetchDisciplinas = async () => {
    
    try {
      const response = await get('/api/disciplinas/buscar');
      console.log('craziii')
      console.log(response)

      const transformedData = response.content.map(item => ({
        id: item.id,
        nome: item.nome
      }));

      setDisciplinas(transformedData);
      
    } catch (error) {
      console.log(error);
    }
  };

  // get one experimento to uodate
  const handleEdit = async (experimentoId,disciplinaId,userId) => {
    // Function for handling edit action
    console.log(`Edit clicked for id ${experimentoId}`);
    setLoading(true);
    try {
      const response = await get(`/api/vinculos/mydisciplinas/experimentos/findbyprof/${experimentoId}/${disciplinaId}/${userId}`);
      console.log('response22')
      let myObject = response.content[0];

      validation.setValues({
        id: myObject.experimentoId.id,
        nome: myObject.experimentoId.nome,
        obs: myObject.experimentoId.obs,
        selectOption: myObject.disciplinaId.id
      });

      setIsEditing(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setAlert(true);
      setAlertMsg('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      setcolorAlert('danger');
      setLoading(false);
    }

  };



  const handleRemove = async (experimentoId) => {
    // Function for handling remove action
    
    try {
      setLoading(true);
      const response = await del(`/api/experimento/delete/${experimentoId}`);

      
      setAlertMsg('Experimento Apagado com sucesso!');
      setcolorAlert('success');
      fetchUsers(currentPage);

      setIsEditing(false);
      setLoading(false);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      //setError(error);
      setLoading(false);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      setAlert(true);
      setAlertMsg('Error ao apagar a disciplina');
      setcolorAlert('danger');
      console.log(error);
    }

  };


  const handleClearForm = () => {
    validation.resetForm(); // This will reset all form fields and errors
  };

  const handleInputSearch = async (buscaString) => {
    try {
      setLoading(true);
      setCurrentPage(0)
      const response = await post('/api/vinculos/mydisciplinas/experimentos/findexp',
      {
        searchRequest: buscaString
      },
      {
        params: {
          page: 0,
          size: perPage,
        },
      });

      setData(response.content);


    let total = response.totalPages == 0 ? 1 : response.totalPages
      setTotalRows(total)
      setLoading(false);
      //setPaginationKey(Date.now()); 
      setCurrentPage(response.number)
    } catch (error) {
      //setError(error);
      setLoading(false);
      setAlertMsg('Um erro inesperado aconteceu. Tente novamente mais tarde.');
      setcolorAlert('danger');
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers(0);
    fetchDisciplinas();
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.style.cursor = 'wait';
    } else {
      document.body.style.cursor = 'default';
    }
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [loading]);

  const t_col5 = () => {
    setcol5(!col5);
  };
  
  const handlePageChange = page => {
		fetchUsers(page-1);
	};

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Profile")}
            breadcrumbItem={props.t("Experimento")}
          />

          
            <Card className="p-3">
            <Alert color={colorAlert} isOpen={alert} toggle={() => {
                setAlert(false)
              }}>
                {alertMsg}
            </Alert>
              <CardBody>
                  <CardTitle>Experimentos Cadastrados</CardTitle>
                  <CardSubtitle className={`font-14 text-muted ${styles.myButton  } `}>
                    Abaixo contém a lista de experimentos cadastrados46
                    <button
                    onClick={t_col5}
                    className="btn btn-primary mo-mb-2"
                    type="button"
                    style={{ cursor: "pointer" }}
                  >
                     <i className={`${col5 ? 'bx bx-hide' :'bx bx-show' }`}></i>
                  </button>
                  </CardSubtitle>
 
                </CardBody>
                <Collapse isOpen={col5}>
                  <TableContainer
                      columns={columns}
                      data={data}
                      className="custom-header-css"
                      handleInputSearch={handleInputSearch}
                      onPageChange={handlePageChange}
                  />
                </Collapse>
                <Pagination  key={loading} currentPage={currentPage+1}
                  totalPages={totalRows} onPageChange={handlePageChange} />
            </Card>

            <Card className="p-3">
              <CardBody>
                <CardTitle>{isEditing ? 'Editar Experimento' : 'Adicionar Experimento'}</CardTitle>
                <CardSubtitle className="font-14 text-muted">
                  Use o campo abaixo para adicionar um experimento à disciplina.
                </CardSubtitle>
                <Form
                    className="form-horizontal"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                  <div className="mb-3">
                    <Label className="form-label">Nome</Label>
                    <Input
                      name="nome"
                      className="form-control"
                      placeholder="Digite o nome da disciplina"
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
                  </div>
                  <div className="mb-3">
                    <Label className="form-label">Disciplina</Label>
                    <Input
                      type="select"
                      name="selectOption"
                      onChange={validation.handleChange}  
                      onBlur={validation.handleBlur}
                      value={validation.values.selectOption || ""}
                      invalid={
                        validation.touched.selectOption && validation.errors.selectOption ? true : false
                      }
                    >
                      <option value="">Selecione</option>
                      {disciplinas.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.nome}
                        </option>
                      ))}
                      
                    </Input>
                    {validation.touched.selectOption && validation.errors.selectOption ? (
                      <FormFeedback type="invalid">
                        {validation.errors.selectOption}
                      </FormFeedback>
                    ) : null}
                  </div>
                  
                  <div className="mb-3">
                    <Label className="form-label">Observação</Label>
                    <Input
                      name="obs"
                      className="form-control"
                      placeholder="Digite o nome da disciplina"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.obs || ""}
                      invalid={
                        validation.touched.obs && validation.errors.obs ? true : false
                      }
                    />
                    {validation.touched.obs && validation.errors.obs ? (
                      <FormFeedback type="invalid">{validation.errors.obs}</FormFeedback>
                    ) : null}
                  </div>
                  <div className="d-flex justify-content-end ">
                  <Button color="secondary" type="submit" className="me-2" onClick={handleClearForm}>
                      Limpar formulário
                  </Button>
                    <Button color="primary" type="submit">
                      {isEditing ? 'Editar formulário' : 'Submeter formulário'}
                    </Button>
                  </div>

                </Form>
              </CardBody>
            </Card>
            <Col xl="12">
              <button
                className="btn mb-3 btn-soft-primary text-muted d-none d-sm-inline-block btn-link"
                onClick={() => navigate(-1) } style={{ textDecoration: 'none' }}
              >
                <i className="mdi mdi-arrow-left me-1" /> Voltar
              </button>
            </Col>
          </Container>
      </div>
    </React.Fragment>
  );
};


export default withTranslation()(UserProfileExperimentoAdd);
