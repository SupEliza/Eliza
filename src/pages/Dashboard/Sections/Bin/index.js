import { useEffect, useState } from "react";
import styled from "styled-components";
import { deleteTransfer, getDeletedTransfers, remTransferFromBin } from "../../../../services/transfers";
import ReloadPNG from "../../../../assets/images/reload.png";
import { Tooltip } from "react-tooltip";
import SmallLoad from "../../../../components/SmallLoad";
import deletePNG from "../../../../assets/images/delete.png";
import undeletePNG from "../../../../assets/images/undelete.png";
import viewPNG from "../../../../assets/images/view.png";
import ConfirmModal from "../../../../components/ConfirmModal";
import { useNotify } from "../../../../hooks/Notify/notifyContext";
import { deleteCode, getDeletedCodes, remCodeFromBin } from "../../../../services/codes";
import { deleteNote, getDeletedNotes, remNoteFromBin } from "../../../../services/notes";
import CircleLoad from "../../../../components/CircleLoad";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  gap: 1rem;
  min-height: 100%;
`;

const Header = styled.div`
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

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  height: 100%;
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

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--total-background);
  border-radius: 1rem;
  color: white;
  height: 100%;
  width: 4rem;
`

const ReloadIcon = styled.img`
  width: 3rem;
  cursor: pointer;
  transition: all 0.5s ease-in-out;

  &:hover{
    transform: rotate(360deg);
  }
`;

const BinListContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: white;
  border-radius: 1rem;
  padding: 1rem;
  overflow: hidden;
  gap: .5rem;
  text-align: center;
  height: 100%;
  width: 100%;
  border: 1px solid rgba(11, 35, 97, 0.3);
`;

const BinListHeader = styled.div`
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

const BinListElement = styled.div`
  display: ${({ binContent, isMobile }) => (binContent === "ID" ? (isMobile ? "none" : "flex") : "flex")};
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

const BinContentList = styled.div`
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

const BinPointer = styled.p`
  cursor: pointer;
`;

const User = styled.div`
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

const ActionIcon = styled.img`
  width: 1rem;
  cursor: pointer;

  @media screen and (min-width: 768px){
    width: 2rem;
  }
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

function Bin(){
  const [binContentList, setBinContentList] = useState([]);
  const [binType, setbinType] = useState("Baixas");
  const [loading, setLoading] = useState(false);
  const [binContentsLimit, setbinContentsLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [confirmationText, setConfirmationText] = useState("");
  const [confirmUndeleteOpen, setConfirmUndeleteOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [binContentID, setbinContentID] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState({ binContent: "", ascending: false });
  const { addNotification } = useNotify();

  async function fetchInfos(binContent) {
    try {
      setLoading(true);
      let response;
      
      switch (binContent) {
        case "Baixas":
          response = await getDeletedCodes(binContentsLimit);
          break;
        case "Transferências":
          response = await getDeletedTransfers(binContentsLimit);
          break;
        case "Notas": 
          response = await getDeletedNotes(binContentsLimit);
          break;
        default:
          response = { success: false };
      }

      if (response.success) {
        if (binContent === "Baixas") setBinContentList(response.codes);
        if (binContent === "Transferências") setBinContentList(response.transfers);
        if (binContent === "Notas") setBinContentList(response.notes);

        setTotalItems(response.total);
      } else {
        setBinContentList([]);
      }
    } catch (error) {
      console.error(error);
      setBinContentList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.title = `Lixeira | ${binType}`;
    fetchInfos(binType);
  }, [binType, binContentsLimit]);

  function orderList(binContent) {
    setBinContentList((prevList) => {
      let sortedList = [...prevList];
      const isAscending = sortOrder.binContent === binContent ? !sortOrder.ascending : true;

      switch (binContent) {
        case "Usuário":
          sortedList.sort((a, b) =>
            isAscending ? a.user_add.localeCompare(b.user_add) : b.user_add.localeCompare(a.user_add)
          );
          break;
        case "Data/Hora":
          sortedList.sort((a, b) =>
            isAscending
              ? new Date(a.created_at) - new Date(b.created_at)
              : new Date(b.created_at) - new Date(a.created_at)
          );
          break;
          case "T. Itens":
            if (binType === "Transferências" || binType === "Notas") {
              sortedList.sort((a, b) =>
                isAscending
                  ? (a.items?.length ?? 0) - (b.items?.length ?? 0)
                  : (b.items?.length ?? 0) - (a.items?.length ?? 0)
              );
            }
            break;
        case "Empresa":
          sortedList.sort((a, b) =>
            isAscending ? a.company.localeCompare(b.company) : b.company.localeCompare(a.company)
          );
          break;
        case "Coleta":
          sortedList.sort((a, b) =>
            isAscending ? new Date(a.collection_date) - new Date(b.collection_date) : new Date(b.collection_date) - new Date(a.collection_date)
          );
          break;
        case "EAN":
          sortedList.sort((a, b) =>
            isAscending ? a.ean.localeCompare(b.ean) : b.ean.localeCompare(a.ean)
          );
          break;
        case "QTD":
          sortedList.sort((a, b) =>
            isAscending ? a.quantity - b.quantity : b.quantity - a.quantity
          );
          break;
        default:
          return prevList;
      }

      setSortOrder({ binContent, ascending: isAscending });
      return [...sortedList];
    });
  }

  function openConfirmDelete(id) {
    setConfirmDeleteOpen(true);
    setbinContentID(id);
    setConfirmationText("Tem certeza que deseja excluir?");
  }

  function openConfirmUndelete(id) {
    setConfirmUndeleteOpen(true);
    setbinContentID(id);
    setConfirmationText("Tem certeza que deseja restaurar?");
  }

  async function handleRemFromBin(binContent) {
    setModalLoading(true);
    let response;

    try {
      switch (binContent) {
        case "Baixas":
          response = await remCodeFromBin(binContentID);
          break;
        case "Transferências":
          response = await remTransferFromBin(binContentID);
          break;
        case "Notas": 
          response = await remNoteFromBin(binContentID);
          break;
        default:
          response = { success: false };
      }

      if (response.success) {
        fetchInfos(binType);
      }

      setConfirmUndeleteOpen(false);
      addNotification(response.message || "Erro ao restaurar");
    } catch (error) {
      console.log(error);
    }
    setModalLoading(false);
  }

  async function handleDeleteFromBin(binContent) {
    setModalLoading(true);
    let response;

    try {
      switch (binContent) {
        case "Baixas":
          response = await deleteCode(binContentID);
          break;
        case "Transferências":
          response = await deleteTransfer(binContentID);
          break;
        case "Notas": 
          response = await deleteNote(binContentID);
          break;
        default:
          response = { success: false };
      }

      if (response.success) {
        fetchInfos(binType);
      }

      setConfirmDeleteOpen(false);
      addNotification(response.message || "Erro ao excluir");
    } catch (error) {
      console.log(error);
    }
    setModalLoading(false);
  }

  const sectionAttributes = [
    {
      binContent: "Baixas",
      headerList: [
        { name: "EAN", action: () => orderList("EAN") },
        { name: "QTD", action: () => orderList("QTD") },
        { name: "Usuário", action: () => orderList("Usuário") },
        { name: "Data/Hora", action: () => orderList("Data/Hora") },
        { name: "Ações" }
      ]
    },
    {
      binContent: "Transferências",
      headerList: [
        { name: "Usuário", action: () => orderList("Usuário") },
        { name: "Data/Hora", action: () => orderList("Data/Hora") },
        { name: "T. Itens", action: () => orderList("T. Itens") },
        { name: "Ações" }
      ]
    },
    {
      binContent: "Notas",
      headerList: [
        { name: "Empresa", action: () => orderList("Empresa") },
        { name: "T. Itens", action: () => orderList("T. Itens") },
        { name: "Data/Hora", action: () => orderList("Data/Hora") },
        { name: "Coleta", action: () => orderList("Coleta") },
        { name: "Ações" }
      ]
    }
  ];

  const currentSection = sectionAttributes.find(s => s.binContent === binType);

  function renderRowContent(binType, binContent) {
    if (binType === "Baixas") {
      return [
        binContent.ean,
        binContent.quantity,
        binContent.user_add,
        new Date(binContent.created_at).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          dateStyle: "short",
          timeStyle: "short",
        }),
      ];
    }

    if (binType === "Transferências") {
      return [
        binContent.user_add,
        new Date(binContent.created_at).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          dateStyle: "short",
          timeStyle: "short",
        }),
        binContent.items?.length ?? 0,
      ];
    }

    if (binType === "Notas") {
      return [
        binContent.company,
        binContent.items?.length ?? 0,
        new Date(binContent.created_at).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          dateStyle: "short",
          timeStyle: "short",
        }),
        binContent.collection_date
          ? new Date(binContent.collection_date).toLocaleDateString("pt-BR")
          : "-",
      ];
    }

    return [];
  }

  return (
    <Container>
      <Header>
        <Title>Lixeira</Title>
        <HeaderRight>
          <select onChange={(e) => setbinType(e.target.value)} value={binType}>
            <option>Baixas</option>
            <option>Transferências</option>
            <option>Notas</option>
          </select>
          <ReloadIcon onClick={() => fetchInfos(binType)} src={ReloadPNG} alt="reload"/>
            <TotalContainer>
              {loading ? <CircleLoad color='white'/> : totalItems}
            </TotalContainer>
        </HeaderRight>
      </Header>

      <BinListContainer>
        <BinListHeader>
          {currentSection.headerList.map((header) => (
            <BinListElement key={header.name} isHeader>
              {header.action ? (
                <BinPointer onClick={header.action}>
                  {header.name} {sortOrder.binContent === header.name && (sortOrder.ascending ? "▲" : "▼")}
                </BinPointer>
              ) : (
                header.name
              )}
            </BinListElement>
          ))}
        </BinListHeader>

        {loading ? <SmallLoad/> : 
          binContentList.length !== 0 ? (
            <BinContentList>
              {binContentList.map((binContent) => (
                <User key={binContent.id}>
                  {renderRowContent(binType, binContent).map((value, idx) => (
                    <BinListElement key={idx}>{value}</BinListElement>
                  ))}

                  <BinListElement>
                    <ActionIcon data-tooltip-id="delete" onClick={() => openConfirmDelete(binContent.id)} src={deletePNG} alt="Deletar"/>
                    <ActionIcon data-tooltip-id="remove" onClick={() => openConfirmUndelete(binContent.id)} src={undeletePNG} alt="Recuperar"/>
                    {binType === "Transferências" && (
                      <ActionIcon data-tooltip-id="view" onClick={() => {window.open(`/dashboard/view/transfer/${binContent.id}`, "_blank")}} src={viewPNG} alt="Visualizar"/>
                    )}

                    {binType === "Notas" && (
                      <ActionIcon data-tooltip-id="view" onClick={() => {window.open(`/dashboard/view/note/${binContent.id}`, "_blank")}} src={viewPNG} alt="Visualizar"/>
                    )}

                    <Tooltip id="delete" place="top" content="Deletar"/>
                    <Tooltip id="remove" place="top" content="Restaurar"/>
                      {(binType === "Transferências" || binType === "Notas") && (
                        <Tooltip id="view" place="top" content="Visualizar" />
                      )}
                    </BinListElement>
                </User>
              ))}

              {totalItems > binContentList.length && (
                <BinListElement>
                  <LoadMoreButton onClick={() => setbinContentsLimit(prev => prev + 10)}>Carregar mais</LoadMoreButton>
                </BinListElement>
              )}
            </BinContentList>
          ) : <p>Nenhum registro encontrado.</p>
        }
      </BinListContainer>    

      <ConfirmModal isOpen={confirmDeleteOpen} setIsOpen={setConfirmDeleteOpen} text={confirmationText} action={() => handleDeleteFromBin(binType)} modalLoading={modalLoading}/>
      <ConfirmModal isOpen={confirmUndeleteOpen} setIsOpen={setConfirmUndeleteOpen} text={confirmationText} action={() => handleRemFromBin(binType)} modalLoading={modalLoading}/>
    </Container>
  );
}

export default Bin;