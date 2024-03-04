import React, {  useState,useMemo, useEffect  } from "react";
import { useNavigate,useLocation } from 'react-router-dom';

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

  const location = useLocation();
  const disciplinaId = location.state?.id || [];



  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [showBad, setShowBad] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [colorAlert, setcolorAlert] = useState('success');


  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: '',
      nome: '',
      orderid: ''
    },
    validationSchema: Yup.object({
      nome: Yup.string().required("Por favor, digite o nome da disciplina"),
      orderid: Yup.string().required("Por favor, digite o código da disciplina"),
    }),
    onSubmit: (values) => {

      const handleSubmission = async () => {
        try {
          const response = await post('/api/disciplinas/salvar', {
            nome: values.nome.trimStart(),
            orderid: values.orderid.trimStart()
          });
          
          validation.setValues({
            id: '',
            nome: ' ' ,
            orderid: ''
          });

          navigate('/disciplinas/adicionar');

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
            nome: values.nome.trimStart(),
            orderid: values.orderid.trimStart()
          });
    
          setAlert(true);
          setAlertMsg('Disciplina atualizada com sucesso!');
          setcolorAlert('success');
          
          setShow(true);


          validation.setValues({
            id: '',
            nome: '',
            orderid: '' 
          });

          navigate('/disciplinas/adicionar');
    
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

  const fetchUDisciplina = async (page) => {
    console.log('entrou')
console.log(disciplinaId)

    if(typeof disciplinaId === 'number' && Number.isInteger(disciplinaId)){

      try {
        const response = await get(`/api/disciplinas/findbyid/${disciplinaId}`);
  
        validation.setValues({
          id: response.id,
          nome: response.nome ,
          orderid: response.orderid
        });
  
      } catch (error) {
        console.log(error);
        setShowBad(true);
      }

    }


  };

  useEffect(() => {
    fetchUDisciplina();
  }, [disciplinaId]);

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
            <div id="liveAlertPlaceholder">
              <Alert isOpen={show} toggle={() => {
                setShow(false)
              }}>
                Nice, you triggered this alert message!
              </Alert>
            </div>
            <div id="liveAlertPlaceholder">
              <Alert color="danger" isOpen={showBad} toggle={() => {
                setShowBad(false)
              }}>
                Erro de servidor! Por favor, contate o suporte.
              </Alert>
            </div>
            <CardBody>
                  <CardTitle>Adicionar disciplina</CardTitle>
                  <CardSubtitle className="font-14 text-muted">
                    Use o campo abaixo para adicionar uma disciplina ao sistema.
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
                      <Label className="form-label">Código</Label>
                      <Input
                        name="orderid"
                        className="form-control"
                        placeholder="Digite o código da disciplina"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.orderid || ""}
                        invalid={
                          validation.touched.orderid && validation.errors.orderid ? true : false
                        }
                      />
                      {validation.touched.orderid && validation.errors.orderid ? (
                        <FormFeedback type="invalid">{validation.errors.orderid}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="d-flex justify-content-end">
                      <Button color="primary" type="submit">
                        Submeter formulário
                      </Button>
                    </div>

                    </Form>
            </CardBody>
            </Card>
          </Container>
      </div>
    </React.Fragment>
  );
};


export default withTranslation()(Componentes);
