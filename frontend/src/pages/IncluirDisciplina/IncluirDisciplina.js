import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useParams,useNavigate } from "react-router-dom";
import { del, get, post, put } from "../../helpers/api_helper";
import withRouter from "components/Common/withRouter";
import Pagination from '../../components/Common/Pagination';
import styles from "./style.module.css";

import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Table,
} from "reactstrap";

// TableContainer



import TableContainer from '../../components/Common/TableContainerNoFilter';

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";



//Import Images
import profile1 from "assets/images/profile-img.png";

// import charts

import { getUserProfile } from "store/actions";

const IncluirDisciplina = props => {
  const navigate = useNavigate();
  //meta title
  document.title = "Profile | Skote - React Admin & Dashboard Template";

  const { userProfile, onGetUserProfile } = props;
  // eslint-disable-next-line no-unused-vars

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchUsers(0);
  }, []);

  useEffect(() => {
    onGetUserProfile();
  }, [onGetUserProfile]);

  const columns = useMemo(
    () => [

      {
        Header: 'Nome',
        accessor: 'disciplinaId.nome',
      },
      {
        Header: 'Ações',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">

          <Link to={`/profile/experimentoadd/${row.original.disciplinaId.id}`} className="d-inline-block mx-2">
            <i className="bx bx-add-to-queue" style={{ fontSize: '24px', color: '#556ee6'  }}></i>
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

  const handlePageChange = page => {
		fetchUsers(page-1);
	};

  const fetchUsers = async (page) => {
   
  try {
    setLoading(true);
    const response = await get('/api/vinculos/mydisciplinas', {
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
    const response = await post('/api/vinculos/mydisciplinas',
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Disciplina" breadcrumbItem="Gerenciar"  />

          <Row>

            <Col xl="12">

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <CardTitle className="mb-4">Minhas disciplinas</CardTitle>
                    <div className={`ms-1 ${styles.myicon  } `}>

                    </div>
                  </div>

                  <TableContainer
                      columns={columns}
                      data={data}
                      className="custom-header-css"
                      handleInputSearch={handleInputSearch}
                      onPageChange={handlePageChange}
                      showButtonLink={true}
                      buttonLink="/profile/mydisciplina"
                      buttonText="Adicionar disciplina"
                  />
                <Pagination  key={loading} currentPage={currentPage+1}
                 totalPages={totalRows} onPageChange={handlePageChange} />
                </CardBody>
              </Card>
            </Col>


          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

IncluirDisciplina.propTypes = {
  userProfile: PropTypes.any,
  onGetUserProfile: PropTypes.func,
};

const mapStateToProps = ({ contacts }) => ({
  userProfile: contacts.userProfile,
});

const mapDispatchToProps = dispatch => ({
  onGetUserProfile: () => dispatch(getUserProfile()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(IncluirDisciplina));
