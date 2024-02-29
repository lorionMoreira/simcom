import React, {  useState,useMemo, useEffect  } from "react";
import styles from "./style.module.css";
import {
  Button,
  Container,
  Card,
  Alert,
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

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//i18n
import { withTranslation } from "react-i18next";
const Componentes = props => {

  const columns = useMemo(
    () => [
      {
        Header: 'Código',
        accessor: 'orderid',
      },
      {
        Header: 'Nome',
        accessor: 'nome',
      },
      {
        Header: 'Ações',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">
            <a
              className="d-inline-block "
              onClick={() => handleEdit(row.original.id)}
            >
              <i className="bx bx-edit-alt" style={{ fontSize: '24px', color: '#556ee6'  }}></i>
            </a>

            <a
              className="d-inline-block mx-2"
              onClick={() => handleRemove(row.original.id)}
            >
              <i className="bx bx-x" style={{ fontSize: '24px', color: '#DC143C'  }}></i>
            </a>
          </div>
        ),
      },
    ],
    []
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginationKey, setPaginationKey] = useState(Date.now());

  const [show, setShow] = useState(false);
  const [showBad, setShowBad] = useState(false);

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
    },
    validationSchema: Yup.object({
      nome: Yup.string().required("Por favor, digite o nome da disciplina"),
    }),
    onSubmit: (values) => {

      const handleSubmission = async () => {
        try {
          const response = await post('/api/disciplinas/salvar', {
            nome: values.nome.trimStart()
          });
          
          setAlert(true);
          setAlertMsg('Disciplina salva com sucesso!');
          setcolorAlert('success');
          fetchUsers(currentPage);

          validation.setValues({
            id: '',
            nome: ' ' 
          });

        } catch (error) {
          console.log(error);
          setShowBad(true);
        }
      };

      const handleUpdate = async (id) => {
        // Function for handling edit action
        console.log(`Edit clicked for id ${id}`);
    
        try {
          const response = await put(`/api/disciplinas/update/${id}`, {
            nome: values.nome.trimStart()
          });
    
          setAlert(true);
          setAlertMsg('Disciplina atualizada com sucesso!');
          setcolorAlert('success');
          
          setShow(true);
          fetchUsers(currentPage);

          validation.setValues({
            id: '',
            nome: ' ' 
          });
          
    
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

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await get('/api/disciplinas/buscar', {
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
  const handleEdit = async (id) => {
    // Function for handling edit action
    console.log(`Edit clicked for id ${id}`);

    try {
      const response = await get(`/api/disciplinas/findbyid/${id}`);

      validation.setValues({
        id: response.id,
        nome: response.nome 
      });

    } catch (error) {
      console.log(error);
      setShowBad(true);
    }

  };



  const handleRemove = async (id) => {
    // Function for handling remove action
    try {
      setLoading(true);
      const response = await del(`/api/disciplinas/delete/${id}`);

      setAlert(true);
      setAlertMsg('Disciplina Apagada com sucesso!');
      setcolorAlert('success');
      fetchUsers(currentPage);

    } catch (error) {
      //setError(error);
      setLoading(false);
      setAlert(true);
      setAlertMsg('Error ao apagar a disciplina');
      setcolorAlert('danger');
      console.log(error);
    }

  };
  const handleInputSearch = async (buscaString) => {
    try {
      setLoading(true);
      setCurrentPage(0)
      const response = await post('/api/disciplinas/buscar',
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
  }, []);
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
            title={props.t("Disciplinas")}
            breadcrumbItem={props.t("Adicionar")}
          />

          
            <Card className="p-3">
              <Alert color={colorAlert} isOpen={alert} toggle={() => {
                  setAlert(false)
                }}>
                  {alertMsg}
              </Alert>
              <CardBody>
                  <CardTitle>Disciplinas cadastradas</CardTitle>
                  <CardSubtitle className={`font-14 text-muted ${styles.myButton  } `}>
                    Abaixo contém a lista de disciplinas cadastradas

                  </CardSubtitle>
 
                </CardBody>
                <Collapse isOpen={col5}>
                  <TableContainer
                      columns={columns}
                      data={data}
                      className="custom-header-css"
                      handleInputSearch={handleInputSearch}
                      onPageChange={handlePageChange}
                      showButtonLink={true}
                      buttonLink="/disciplinas/adicionar2"
                      buttonText="Nova Disciplina"
                  />
                </Collapse>
                <Pagination  key={loading} currentPage={currentPage+1}
                 totalPages={totalRows} onPageChange={handlePageChange} />
            </Card>
          </Container>
      </div>
    </React.Fragment>
  );
};


export default withTranslation()(Componentes);
