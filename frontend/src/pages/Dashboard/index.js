import React, {  useState,useMemo, useEffect  } from "react";
import {
  Container,
  Col,
  Row,
  Card,
} from "reactstrap";
//Import Breadcrumb
import { del, get, post, put } from "../../helpers/api_helper";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from '../../components/Common/TableContainer';
import Pagination from '../../components/Common/Pagination';
//i18n
import { withTranslation } from "react-i18next";
const Dashboard = props => {

  const columns = useMemo(
    () => [
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
    const response = await get('http://localhost:8080/componentes/buscar', {
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

const handleInputSearch = async (buscaString) => {
  try {
    setLoading(true);
    setCurrentPage(0)
    const response = await post('http://localhost:8080/componentes/buscar',
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
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard")}
          />

          </Container>
          </div>
    </React.Fragment>
  );
};


export default withTranslation()(Dashboard);
