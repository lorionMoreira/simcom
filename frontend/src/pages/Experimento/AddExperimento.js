import React, {  useState,useMemo, useEffect  } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
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
const UserProfileExperimentoAdd = props => {

  const { experimentoId } = useParams();

  const [selectedRows, setSelectedRows] = useState([]);

  const [hasNotInputs, sethasNotInputs] = useState(true);

  const columns1 = useMemo(
    () => [

      {
        Header: 'Identificador',
        accessor: 'id',
      },
      {
        Header: 'Componente',
        accessor: 'tipoComponenteId.nome',
      },
      {
        Header: 'Especificação',
        accessor: 'tipoComponenteId.especificacao',
      },
      {
        Header: 'Quantidade',
        accessor: 'quantidade',
      },
      {
        Header: 'Ações',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">

            <a
              className="d-inline-block mx-2"
              onClick={() => handleRemove(row.original.id,row.original.experimentoId.id)}//experimentoId
              title="Apagar experimento"
            >
              <i className="bx bx-trash-alt" style={{ fontSize: '24px', color: '#DC143C'  }}></i>
            </a>
            
          </div>
        ),
      },
    ],
    []
  );

  const columns2 = useMemo(
    () => [
      {
        Header: 'Seleção',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">

            {row.original.tipoComponente ? ( // Check if tipoComponente exists
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
                    experimentoId
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
        Header: 'Nome',
        accessor: 'tipoComponente.nome',
      },
      {
        Header: 'Valor',
        accessor: 'tipoComponente.valor',
      },
      {
        Header: 'Unidade',
        accessor: 'tipoComponente.unidadeId.nome',
      },
      {
        Header: 'Especificacao',
        accessor: 'tipoComponente.especificacao',
      },
      {
        Header: 'local',
        accessor: 'local',
      },

    ],
    [selectedRows]
  );

  useEffect(() => {
    console.log('Selected Rows:', selectedRows);
    sethasNotInputs(selectedRows.length === 0)
  }, [selectedRows]);
  
 

  // Function to add a row ID to the selectedRows array
  const addSelection = (id, tipoComponenteId,nome,especificacao,valor,unidade) => {
    setSelectedRows((prevSelectedRows) => [...prevSelectedRows, { id, tipoComponenteId,nome,
      especificacao,valor,unidade,experimentoId }]);

      sethasNotInputs(false);
  };

  // Function to remove a row ID from the selectedRows array
  const removeSelection = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.filter((row) => row.id !== id )
    );

  };



  const [data1, setData1] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [totalRows1, setTotalRows1] = useState(1);
  const [perPage1, setPerPage1] = useState(10);
  const [currentPage1, setCurrentPage1] = useState(0);

  const [data2, setData2] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [totalRows2, setTotalRows2] = useState(1);
  const [perPage2, setPerPage2] = useState(10);
  const [currentPage2, setCurrentPage2] = useState(0);


  const [isEditing, setIsEditing] = useState(false);


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
      obs: ''
    },
    validationSchema: Yup.object({
      nome: Yup.string().required("Por favor, digite o nome da disciplina"),
    }),
    onSubmit: (values) => {
      // table experimento
      const handleSubmission = async () => {
        try {
          const response = await post(`/api/experimento/salvar/${disciplinaId}`, {
            nome: values.nome.trimStart(),
            obs: values.obs.trimStart()
          });
          
          setAlert(true);
          setAlertMsg('Disciplina salva com sucesso!');
          setcolorAlert('success');
          //fetchUsers(currentPage);

          validation.setValues({
            id: '',
            nome: ' ' ,
            obs: ' '
          });

          setIsEditing(false);

        } catch (error) {
          console.log(error);
          setShowBad(true);
        }
      };
      //table experimento
      const handleUpdate = async (experimentoId) => {
        // Function for handling edit action
        console.log(`Edit clicked for experimentoId ${experimentoId}`);
    
        try {
          console.log(values)
          const response = await put(`/experimento/update/${experimentoId}`, {
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

  const handleCheckboxChange = (tipoComponenteId) => {
    setCheckedIds((prevIds) => {
      const updatedIds = new Set(prevIds);
  
      if (updatedIds.has(tipoComponenteId)) {
        updatedIds.delete(tipoComponenteId);
      } else {
        updatedIds.add(tipoComponenteId);
      }
  
      return Array.from(updatedIds); // Convert the Set back to an array and return it
    });
  };
  
  // fetch users
  const fetchUsers1 = async (page) => {
    try {
      setLoading1(true);
      const response = await get(`/api/reservas/myreserva/buscar/${experimentoId}`, {
        params: {
          page: page,
          size: perPage1,
        },
      });
      console.log("response1")
      console.log(response)
      setData1(response.content);
      setTotalRows1(response.totalPages)
      setLoading1(false);
      //setPaginationKey(Date.now()); 
      setCurrentPage1(response.number)
     
    } catch (error) {
      //setError(error);
      setLoading1(false);
      console.log(error)
    }
  };

  const fetchUsers2 = async (page) => {
    try {
      setLoading2(true);
      const response = await get('/api/componentes/buscar/index', {
        params: {
          page: page,
          size: perPage2,
        },
      });
      console.log("response2")
      console.log(response)
      setData2(response.content);
      setTotalRows2(response.totalPages)
      setLoading2(false);
      //setPaginationKey(Date.now()); 
      setCurrentPage2(response.number)
     
    } catch (error) {
      //setError(error);
      setLoading2(false);
      console.log(error)
    }
  };
  // get one experimento to uodate
  const handleEdit = async (experimentoId) => {
    // Function for handling edit action
    console.log(`Edit clicked for id ${experimentoId}`);

    try {
      const response = await get(`/api/experimento/mydisciplinas/findbyid/${experimentoId}`);
      
      console.log(response)

      validation.setValues({
        id: response.id,
        nome: response.nome,
        obs: response.obs
      });

      setIsEditing(true);

    } catch (error) {
      console.log(error);
      setAlert(true);
      setAlertMsg('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      setcolorAlert('danger');
    }

  };



  const handleRemove = async (id,experimentoid) => {
    // Function for handling remove action
    console.log("foi bem");
    console.log(id);
    console.log(experimentoid);
    try {
      setLoading1(true);
      const response = await del(`/reservas/delete/${id}/${experimentoid}`);

      setAlert(true);
      setAlertMsg('Experimento Apagado com sucesso!');
      setcolorAlert('success');
      fetchUsers1(0);

      setIsEditing(false);

    } catch (error) {
      //setError(error);
      setLoading(false);
      setAlert(true);
      setAlertMsg('Error ao apagar a disciplina');
      setcolorAlert('danger');
      console.log(error);
    }

  };

  const handleAdd = async (experimentoId) => {
    console.log('ola');
    console.log(experimentoId)
    // Function for handling remove action
    try {
      setLoading(true);
      const response = await del(`/experimento/delete/${experimentoId}`);

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
  const handleClear = () => {
    
    setSelectedRows([]);
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
    fetchUsers1(0);
    fetchUsers2(0);
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
                  <CardTitle>Componentes do experimento</CardTitle>
                  <CardSubtitle className={`font-14 text-muted ${styles.myButton  } `}>
                    Abaixo contém a lista de experimentos cadastrados
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
                      columns={columns1}
                      data={data1}
                      className="custom-header-css"
                      handleInputSearch={handleInputSearch}
                      onPageChange={handlePageChange}
                      
                  />
                </Collapse>
                <Pagination  key={loading1} currentPage1={currentPage1+1}
                 totalPages={totalRows1} onPageChange={handlePageChange} />
            </Card>

            <Card className="p-3">


            <CardBody>
                  <CardTitle>{isEditing ? 'Editar Experimento' : 'Adicionar Componentes'}</CardTitle>
                  <CardSubtitle className="font-14 text-muted">
                    Use o campo abaixo para adicionar uma disciplina ao sistema.
                  </CardSubtitle>

                                   <Collapse isOpen={col5}>
                  <TableContainer
                      columns={columns2}
                      data={data2}
                      className="custom-header-css"
                      handleInputSearch={handleInputSearch}
                      onPageChange={handlePageChange}
                      
                  />
                </Collapse>

                <Pagination  key={loading2} currentPage2={currentPage2+1}
                 totalPages={totalRows2} onPageChange={handlePageChange} />

                <div className="d-flex justify-content-end mt-3 ">
                <Button color="secondary" type="submit" className="me-2" onClick={handleClear}>
                    Limpar formulário
                </Button>
                {hasNotInputs ? (
                    <Button color="primary" type="submit" disabled>
                      {isEditing ? 'Editar formulário' : 'Submeter formulário'}
                    </Button>
                  ) : (
                    <Link to={`/experimentoaddConf/${experimentoId}`} state={{ selectedRows }}>
                      <Button color="primary" type="submit">
                        {isEditing ? 'Editar formulário' : 'Submeter formulário'}
                      </Button>
                    </Link>
                )}
                </div>

                   
            </CardBody>
            </Card>
          </Container>
      </div>
    </React.Fragment>
  );
};


export default withTranslation()(UserProfileExperimentoAdd);
