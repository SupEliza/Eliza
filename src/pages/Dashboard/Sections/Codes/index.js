import { useContext, useEffect, useState } from "react";
import { cleanCodes, getCodes, moveCodeToBin } from "../../../../services/codes";
import { AuthContext } from "../../../../hooks/Authentication/authContext";
import { Tooltip } from "react-tooltip";
import { useNotify } from "../../../../hooks/Notify/notifyContext";
import SmallLoad from "../../../../components/SmallLoad";
import reloadPNG from "../../../../assets/images/reload.png";
import removePNG from "../../../../assets/images/remove.png";
import styled from "styled-components";
import AddCodeModal from "../../../../components/AddCodeModal";
import ConfirmModal from "../../../../components/ConfirmModal";
import TotalContainer from "../../../../components/TotalContainer";
import { ReactComponent as ExportSVG } from "../../../../assets/svg/export.svg";
import { ReactComponent as AddSVG } from "../../../../assets/svg/add.svg";
import { ReactComponent as ClearSVG } from "../../../../assets/svg/clear.svg";
                                                                                                                                                                                                                                                                                                                                                                                                                     
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  gap: 1rem;

  @media screen and (min-width: 550px){
    gap: 0;
    padding: 0 1.2rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
`

const CodesHeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  height: 100%;

  & svg { 
      height: 100%;
      width: 3rem;
      cursor: pointer;
      fill: var(--background);
  }

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
`;

const HeaderButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: var(--background);
  color: var(--secondary-color);
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  width: 6rem;
  height: 3rem;
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
  border: 1px solid rgba(11, 35, 97, 0.3);
  gap: .5rem;
  height: 100%;
  width: 100%; 
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
  margin: .2rem 0;
  width: 100%;
`;

const LoadMoreButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: var(--background);
  color: var(--secondary-color);
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  margin: 1rem;
  padding: 1rem;
  min-width: 8rem;
  cursor: pointer;
`;

function Codes () {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [addCodeOpen, setAddCodeOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [confirmIsOpen, setConfirmIsOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sortOrder, setSortOrder] = useState({ type: "", ascending: false });
  const [totalCodes, setTotalCodes] = useState(0);
  const [codesLimit, setCodesLimit] = useState(10);
  const [codesList, setCodesList] = useState([]);
  const { addNotification } = useNotify();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  async function fetchCodes(append = false) {
    try {
      setLoading(true);
      const response = await getCodes(codesLimit);
  
      if (response.success) {
        setTotalCodes(response.total);
        const undeletedCodes = response.codes
          .filter((code) => !code.isDeleted)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
        setCodesList((prevList) => {
          const newList = append ? [...prevList, ...undeletedCodes] : undeletedCodes;
          return newList.filter((code, index, self) =>
            index === self.findIndex((c) => c.id === code.id)
          );
        });
      } else{
        setCodesList([]);
        setTotalCodes(0);
      }
  
      setSortOrder({ type: "Data/Hora", ascending: false });
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    document.title = "Eliza | Baixas";
    fetchCodes();
  }, [codesLimit]);  

  const handleExport = async () => {
    setExportLoading(true);
    if (codesList.length === 0){ 
      addNotification("Nenhum código registrado!");
      return;
    }

    const response = await getCodes(0);

    if (!response.success) return;

    const exportList = response.codes.filter((code) => !code.isDeleted);

    const txt = exportList.map((code, index) => `EAN ${index + 1}: ${code.ean}\nQTD: ${code.quantity}`).join("\n\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Baixas - ${new Date().toLocaleDateString()}.txt`;
    link.click();
    setExportLoading(false);
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

  async function codeDelete(id){
    try {
      const response = await moveCodeToBin(id);

      if(response.success === true){
        addNotification('Código movido para lixeira');
        setCodesLimit(10);
        fetchCodes();
      }else{
        addNotification('Erro ao deletar código');
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleReloadCodes() {
    setCodesLimit(10);
    fetchCodes(false);
  }

  function openConfirmModal() {
    if(codesList.length === 0){
      addNotification('Nenhum código registrado!');
      return;
    }

    if(user.user_role !== 'Moderador'){
      addNotification('Você não tem permissão.');
      return;
    }

    setConfirmIsOpen(true);
    setConfirmationText("Tem certeza que deseja limpar todos os códigos?");
  }

  async function handleCleanCodes() {
    setModalLoading(true);
    try {
      const response = await cleanCodes();

      if(response.success === true){
        fetchCodes();
      }

      addNotification(response.message);
      setConfirmationText("");
      setConfirmIsOpen(false);
    } catch (error) {
      addNotification('Erro ao limpar códigos');
      console.log(error);
    }
    setModalLoading(false);
  }

  function handleLoadMore() {
    setCodesLimit((prev) => prev + 10);
    fetchCodes(true);
  }

  function capitalizeFirstLetter(str) {
    if (!str) return "";
    str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
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
        <HeaderLeft>
          <TotalContainer loading={loading} total={totalCodes} />
        </HeaderLeft>

        <CodesHeaderRight>
          <AddSVG onClick={() => setAddCodeOpen(true)} data-tooltip-id="add"/>
          <ExportSVG onClick={handleExport} data-tooltip-id="export"/>
          <ClearSVG onClick={() => openConfirmModal()} data-tooltip-id="clear"/>
          <ReloadIcon onClick={handleReloadCodes} src={reloadPNG} data-tooltip-id="reload"/>

          <Tooltip id="add" place="top" content="Adicionar código"/>
          <Tooltip id="clear" place="top" content="Limpar todos os códigos"/>
          <Tooltip id="export" place="top" content="Exportar todos os códigos"/>
          <Tooltip id="reload" place="top" content="Recarregar lista"/>
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
                <Code key={`${code.id}-${code.created_at}`}>
                  <CodeListElement>
                    <CodePointer data-tooltip-id="copy" onClick={() => copyToClipboard(code.ean)}>
                      {code.ean}
                      <Tooltip id="copy" place="top" content="Copiar"/>
                    </CodePointer>
                  </CodeListElement>
                  <CodeListElement>{code.quantity}</CodeListElement>
                  <CodeListElement>{capitalizeFirstLetter(code.user_add)}</CodeListElement>
                  <CodeListElement>
                    {new Date(code.created_at).toLocaleString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </CodeListElement>
                  <CodeListElement>
                    <ActionIcon data-tooltip-id="remove" onClick={() => codeDelete(code.id)} src={removePNG} alt="Deletar"/>
                    <Tooltip id="remove" place="top" content="Mover para lixeira"/>
                  </CodeListElement>
                </Code>
              ))}

              {codesLimit < totalCodes && (
                <CodeListElement>
                  <LoadMoreButton onClick={handleLoadMore}>Carregar mais</LoadMoreButton>
                </CodeListElement>
              )}
            </CodeList>
          : <p>Nenhum registro encontrado.</p>
        }
      </CodesListContainer>

      <ConfirmModal isOpen={confirmIsOpen} setIsOpen={setConfirmIsOpen} text={confirmationText} action={handleCleanCodes} modalLoading={modalLoading}/>

      <AddCodeModal
        setIsOpen={setAddCodeOpen}
        isOpen={addCodeOpen}
        title="Adicionar Código"
        fetchCodes={fetchCodes}
      />
    </Container>
  );
}

export default Codes