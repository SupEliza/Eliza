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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  gap: 1rem;
  min-height: 100%;
`;

const TransferHeader = styled.div`
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

const TransferHeaderRight = styled.div`
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

const TransferListContainer = styled.div`
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

const AddButton = styled.button`
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
  padding: 1rem;
  cursor: pointer;
`;

const TransferListHeader = styled.div`
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

const TransferListElement = styled.div`
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

const TransferList = styled.div`
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

const TransferPointer = styled.p`
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
  cursor: pointer;
`;

function Transfers(){
    const [transfersList, setTransfersList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalTransfers, setTotalTransfers] = useState(0);
    const [transfersLimit, setTransfersLimit] = useState(10);
    const [confirmationText, setConfirmationText] = useState("");
    const [confirmUndeleteOpen, setConfirmUndeleteOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [transferID, setTransferID] = useState("");
    const [modalLoading, setModalLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState({ type: "", ascending: false });
      const { addNotification } = useNotify();

    async function fetchTransfers(append = false) {
        try {
        setLoading(true);
        const response = await getDeletedTransfers(transfersLimit);
    
        if (response.success) {
            setTotalTransfers(response.total);
            const deletedTransfers = response.transfers
            .filter((transfer) => transfer.isDeleted)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
            setTransfersList((prevList) => {
            const newList = append ? [...prevList, ...deletedTransfers] : deletedTransfers;
            return newList.filter((code, index, self) =>
                index === self.findIndex((c) => c.id === code.id)
            );
            });
        } else{
            setTransfersList([]);
            setTotalTransfers(0);
        }
    
        setSortOrder({ type: "Data/Hora", ascending: false });
        setLoading(false);
        } catch (error) {
        console.error(error);
        }
    }

    useEffect(() => {
        document.title = "Eliza | Transferências";
        fetchTransfers();
    }, [transfersLimit])

      function orderList(type) {
        setTransfersList((prevList) => {
        let sortedList = [...prevList];
        const isAscending = sortOrder.type === type ? !sortOrder.ascending : true;

        switch (type) {
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
            sortedList.sort((a, b) => (isAscending ? a.items.length - b.items.length : b.items.length - a.items.length));
            break;
            default:
            return prevList;
        }

        setSortOrder({ type, ascending: isAscending });
        return [...sortedList];
        });
    }

    function openConfirmDelete(id) {
      setConfirmDeleteOpen(true);
      setTransferID(id);
      setConfirmationText("Tem certeza que deseja excluir essa transferência?");
    }

    function openConfirmUndelete(id) {
      setConfirmUndeleteOpen(true);
      setTransferID(id);
      setConfirmationText("Tem certeza que deseja restaurar essa transferência?");
    }

    function handleLoadMore() {
      setTransfersLimit((prev) => prev + 10);
      fetchTransfers(true);
    }

    async function handleRemFromBin() {
      setModalLoading(true);
      try {
        const response = await remTransferFromBin(transferID);
  
        if (response.success) {
          fetchTransfers(false);
        }
  
        setConfirmUndeleteOpen(false);
        addNotification(response.message || "Erro ao restaurar");
      } catch (error) {
        console.log(error);
      }
      setModalLoading(false);
    }

    async function handleDeleteTransfer() {
      setModalLoading(true);
      try {
        const response = await deleteTransfer(transferID);
  
        if (response.success) {
          setTransfersLimit(10);
          fetchTransfers(false);
        }
  
        setConfirmDeleteOpen(false);
        addNotification(response.message || "Erro ao excluir");
      } catch (error) {
        console.log(error);
      }
      setModalLoading(false);
    }

    const headerList = [
        { name: "Usuário", action: () => orderList("Usuário")},
        { name: "Data/Hora", action: () => orderList("Data/Hora")},
        { name: "T. Itens", action: () => orderList("T. Itens")},
        { name: "Ações"}
    ];

    return (
        <Container>
          <TransferHeader>
            <Title>
              Lixeira de Transferências
            </Title>
    
            <TransferHeaderRight>
                <p>Total: {totalTransfers}</p>
    
                <ReloadIcon onClick={fetchTransfers} src={ReloadPNG} alt="reload"/>
            </TransferHeaderRight>
          </TransferHeader>
    
          <TransferListContainer>
            <TransferListHeader>
              {headerList.map((header) => (
                <TransferListElement key={header.name} isHeader>
                  {header.action ? (
                    <TransferPointer onClick={header.action}>
                      {header.name} {sortOrder.type === header.name && (sortOrder.ascending ? "▲" : "▼")}
                    </TransferPointer>
                  ) : (
                    header.name
                  )}
                </TransferListElement>
              ))}
            </TransferListHeader>
    
          {loading ? <SmallLoad/> : 
              transfersList.length !== 0 ?
                <TransferList>
                  {transfersList.map((transfer) => (
                    <User key={transfer.id}>
                      <TransferListElement>{transfer.user_add}</TransferListElement>
                      <TransferListElement>                    
                          {new Date(transfer.created_at).toLocaleString("pt-BR", {
                            timeZone: "America/Sao_Paulo",
                            dateStyle: "short",
                            timeStyle: "short"
                          })}
                      </TransferListElement>
                      <TransferListElement>{transfer.items.length}</TransferListElement>
                      <TransferListElement>
                        <ActionIcon data-tooltip-id="delete" onClick={() => openConfirmDelete(transfer.id)} src={deletePNG} alt="Deletar"/>
                        <ActionIcon data-tooltip-id="remove" onClick={() => openConfirmUndelete(transfer.id)} src={undeletePNG} alt="Recuperar"/>
                        <ActionIcon data-tooltip-id="view" onClick={() => {window.open(`/dashboard/view/transfer/${transfer.id}`, "_blank")}} src={viewPNG} alt="Visualizar"/>

                        <Tooltip id="delete" place="top" content="Deletar transferência"/>
                        <Tooltip id="remove" place="top" content="Restaurar transferência"/>
                        <Tooltip id="view" place="top" content="Visualizar transferência"/>
                      </TransferListElement>
                    </User>
                  ))}
                  {transfersLimit < totalTransfers && (
                    <TransferListElement>
                      <LoadMoreButton onClick={handleLoadMore}>Carregar mais</LoadMoreButton>
                    </TransferListElement>
                  )}
                </TransferList>
              : <p>Nenhum registro encontrado.</p>
            }
          </TransferListContainer>    

          <ConfirmModal isOpen={confirmDeleteOpen} setIsOpen={setConfirmDeleteOpen} text={confirmationText} action={handleDeleteTransfer} modalLoading={modalLoading}/>
          <ConfirmModal isOpen={confirmUndeleteOpen} setIsOpen={setConfirmUndeleteOpen} text={confirmationText} action={handleRemFromBin} modalLoading={modalLoading}/>
        </Container>
    );
}

export default Transfers