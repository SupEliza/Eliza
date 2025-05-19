import { useEffect, useState } from "react";
import { deleteCode, getCodes, remCodeFromBin } from "../../../../services/codes";
import SmallLoad from "../../../../components/SmallLoad";
import reloadPNG from "../../../../assets/images/reload.png";
import deletePNG from "../../../../assets/images/delete.png";
import undeletePNG from "../../../../assets/images/undelete.png";
import styled from "styled-components";
import ConfirmModal from "../../../../components/ConfirmModal";
import { Tooltip } from "react-tooltip";
import { useNotify } from "../../../../hooks/Notify/notifyContext";
                                                                                                                                                                                                                                                                                                                                                                                                                     
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  gap: 1rem;
  min-height: 100%;
`;

const CodesHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  gap: 1rem;

  @media screen and (min-width: 550px){
    gap: 0;
    padding: 0 1.2rem;
    flex-direction: row;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  border-radius: 1rem;
  font-family: "Nunito Sans";
  font-weight: bold;
  color: black;
  font-size: 1.6rem;

  @media screen and (min-width: 768px){
    font-size: 2rem;
  }
`

const CodesHeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  width: 100%;

  @media screen and (min-width: 350px){
    flex-direction: row;
    justify-content: space-evenly;  
  }

  @media screen and (min-width: 550px){
    gap: 1rem;
    width: unset;
  }
`;

const ReloadIcon = styled.img`
  width: 3rem;
  cursor: pointer;
  transition: all 0.5s ease-in-out;

  &:hover{
    transform: rotate(360deg);
  }
`;

const ExportButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: var(--background);
  color: var(--secondary-color);
  border: none;
  font-weight: bold;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
`;

const CodesListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  background-color: white;
  border-radius: 1rem;
  padding: 1rem;
  overflow: hidden;
  gap: .5rem;
  height: 100%;
  width: 100%;
  border: 1px solid rgba(11, 35, 97, 0.3);
`;

const CodesListHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  background-color: var(--background); 
  color: var(--secondary-color);
  border-radius: 0.5rem;
  font-weight: bold;
  padding: .5rem;
  margin: .2rem;
  width: 100%;
`;

const CodeListElement = styled.div`
  display: ${({ type, isMobile }) => (type === "ID" ? (isMobile ? "none" : "flex") : "flex")};
  gap: .2rem;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: "Nunito Sans";
  font-size: ${({isHeader}) => (isHeader ? ".8rem" : ".6rem")};
  box-sizing: border-box;
  text-align: center;
  border-radius: 0.5rem;
  margin: 0.5rem;
  width: ${(props) => props.width || "20%"};
  
  @media screen and (min-width: 768px){
    gap: 1rem;
    font-size: 1rem;
  }
`;

const CodePointer = styled.p`
  cursor: pointer;
`;

const ActionIcon = styled.img`
  width: 1rem;
  cursor: pointer;

  @media screen and (min-width: 768px){
    width: 2rem;
  }
`;

const CodeList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  max-height: 100%;
  width: 100%;

  &::-webkit-scrollbar {
      width: 2px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent; 
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--background);
    border-radius: 5px;
  }
`;

const Code = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  background-color: #FAFAFA;
  border-radius: 0.5rem;
  padding: .5rem;
  margin: .2rem;
  width: 100%;
`;

function BinCodes () {
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sortOrder, setSortOrder] = useState({ type: "", ascending: false });
  const [confirmUndeleteOpen, setConfirmUndeleteOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [codeID, setCodeID] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [codesList, setCodesList] = useState([]);
  const { addNotification } = useNotify();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  async function fetchCodes() {
    try {
      setLoading(true);
      const response = await getCodes(0);
      
      if (response.success === true) {
        const undeletedCodes = response.codes.filter((code) => code.isDeleted).sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
        setCodesList(undeletedCodes);
      }
      setSortOrder({ type: "Data/Hora", ascending: false })
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    fetchCodes();
  }, []);

  function handleExport() {
    if (codesList.length === 0) {
      addNotification("Nenhum código registrado!")
      return;
    };

    const txt = codesList.map((code) => `${code.ean};${code.quantity}`).join("\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lixeira.txt";
    link.click();
  }

  function orderList(type) {
    setCodesList((prevList) => {
      let sortedList = [...prevList];
      const isAscending = sortOrder.type === type ? !sortOrder.ascending : true;

      switch (type) {
        case "Data/Hora":
          sortedList.sort((a, b) =>
            isAscending
              ? new Date(a.created_at) - new Date(b.created_at)
              : new Date(b.created_at) - new Date(a.created_at)
          );
          break;
        case "EAN":
          sortedList.sort((a, b) =>
            isAscending ? a.ean.localeCompare(b.ean) : b.ean.localeCompare(a.ean)
          );
          break;
        case "QTD":
          sortedList.sort((a, b) => (isAscending ? a.quantity - b.quantity : b.quantity - a.quantity));
          break;
        case "Usuário":
          sortedList.sort((a, b) =>
            isAscending ? a.user_add.localeCompare(b.user_add) : b.user_add.localeCompare(a.user_add)
          );
          break;
        default:
          return prevList;
      }

      setSortOrder({ type, ascending: isAscending });
      return [...sortedList];
    });
  }

  function copyToClipboard(text){
    navigator.clipboard.writeText(text);
    addNotification("Código copiado");
  }

  const openConfirmDelete = (id) => {
    setConfirmDeleteOpen(true);
    setCodeID(id);
    setConfirmationText("Tem certeza que deseja excluir esse código?");
  }

  const openConfirmUndelete = (id) => {
    setConfirmUndeleteOpen(true);
    setCodeID(id);
    setConfirmationText("Tem certeza que deseja restaurar esse código?");
  }

  const handleDeleteCode = async () => {
    setModalLoading(true);

    const response = await deleteCode(codeID)

    if (response.success === true) {
      fetchCodes();
    }

    setCodeID("");
    setModalLoading(false);
    setConfirmDeleteOpen(false);
    addNotification(response.message);
  }

  const handleRemoveFromBin = async () => {
    setModalLoading(true);

    const response = await remCodeFromBin(codeID);

    if (response.success === true) {
      fetchCodes();
    }

    setCodeID("");
    setModalLoading(false);
    setConfirmUndeleteOpen(false);
    addNotification(response.message);
  }

  const headerList = [
    { name: "EAN", action: () => orderList("EAN") },
    { name: "QTD", action: () => orderList("QTD") },
    { name: "Usuário", action: () => orderList("Usuário") },
    { name: "Data/Hora", action: () => orderList("Data/Hora") },
    { name: "Ações" }
  ];

  return (
    <Container>
      <CodesHeader>
        <Title>
          Lixeira de Baixas
        </Title>

        <CodesHeaderRight>
          <p>Total: {codesList.length}</p>

          <ReloadIcon onClick={fetchCodes} src={reloadPNG} alt="reload"/>

          <ExportButton type="button" onClick={handleExport}>Exportar</ExportButton>
        </CodesHeaderRight>
      </CodesHeader>
      
      <CodesListContainer>
        <CodesListHeader>
          {headerList.map((header) => (
            <CodeListElement key={header.name} isHeader>
              {header.action ? (
                <CodePointer onClick={header.action}>
                  {header.name} {sortOrder.type === header.name && (sortOrder.ascending ? "▲" : "▼")}
                </CodePointer>
              ) : (
                header.name
              )}
            </CodeListElement>
          ))}
        </CodesListHeader>

        {loading ? <SmallLoad/> : 
          codesList.length !== 0 ?
            <CodeList>
              {codesList.map((code) => (
                <Code key={code.id}>
                  <CodeListElement>
                    <CodePointer data-tooltip-id="copy" onClick={() => copyToClipboard(code.ean)}>
                      {code.ean}
                      <Tooltip id="copy" place="top" content="Copiar"/>
                    </CodePointer>
                  </CodeListElement>
                  <CodeListElement>{code.quantity}</CodeListElement>
                  <CodeListElement>{code.user_add}</CodeListElement>
                  <CodeListElement>
                    {new Date(code.created_at).toLocaleString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </CodeListElement>
                  <CodeListElement>
                    <ActionIcon data-tooltip-id="delete" onClick={() => openConfirmDelete(code.id)} src={deletePNG} alt="Deletar"/>
                    <ActionIcon data-tooltip-id="remove" onClick={() => openConfirmUndelete(code.id)} src={undeletePNG} alt="Recuperar"/>

                    <Tooltip id="delete" place="top" content="Deletar código"/>
                    <Tooltip id="remove" place="top" content="Restaurar código"/>
                  </CodeListElement>
                </Code>
              ))}
            </CodeList>
          : <p>Nenhum registro encontrado.</p>
        }
      </CodesListContainer>

      <ConfirmModal isOpen={confirmUndeleteOpen} setIsOpen={setConfirmUndeleteOpen} text={confirmationText} action={handleRemoveFromBin} modalLoading={modalLoading}/>

      <ConfirmModal isOpen={confirmDeleteOpen} setIsOpen={setConfirmDeleteOpen} text={confirmationText} action={handleDeleteCode} modalLoading={modalLoading}/>

    </Container>
  );
}

export default BinCodes