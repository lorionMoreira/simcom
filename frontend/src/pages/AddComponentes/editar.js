import React, {  useState,useMemo, useEffect  } from "react";
import {
  Container,
  Col,
  Row,
  Card,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//Import Breadcrumb
import { del, get, post, put } from "../../helpers/api_helper";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from '../../components/Common/TableContainerNoFilter';
import Pagination from '../../components/Common/Pagination';
//i18n
import { withTranslation } from "react-i18next";
const Editar = props => {
  const { demoData } = useSelector(state => ({
    demoData: state.Login.demoData,
  }));
  const columns = useMemo(
    () => [
      {
        Header: 'Identificador3',
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
      {
        Header: 'Ações',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">

            <Link to={`/componentes/adicionar2/${row.original.id}`} className="d-inline-block mx-2">
              <i className="bx bx-pencil" style={{ fontSize: '24px', color: '#556ee6'  }}></i>
            </Link>


            <a
              className="d-inline-block mx-2"
              onClick={() => handleRemove(row.original.id)}
            >
              <i className="bx bx-trash-alt" style={{ fontSize: '24px', color: '#DC143C'  }}></i>
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
   console.log(demoData)
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
    const response = await post('/api/componentes/buscar/solicitado',
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

  useEffect(() => {
    fetchUsers(0);
  }, []);

  const handlePageChange = page => {
		fetchUsers(page-1);
	};

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Componentes")}
            breadcrumbItem={props.t("Buscar")}
          />
              <Card className="p-3">
                
                <TableContainer
                    columns={columns}
                    data={data}
                    className="custom-header-css"
                    handleInputSearch={handleInputSearch}
                    onPageChange={handlePageChange}
                    showButtonLink={true}
                    buttonLink="/componentes/adicionar2/0"
                    buttonText="Novo componente"
                />
                <Pagination  key={loading} currentPage={currentPage+1}
                 totalPages={totalRows} onPageChange={handlePageChange} />
              </Card>
          </Container>
          </div>
    </React.Fragment>
  );
};


export default withTranslation()(Editar);
