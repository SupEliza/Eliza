import { useEffect, useState } from "react";
import { deleteNote, getDeletedNotes, remNoteFromBin } from "../../../../services/notes";
import { Tooltip } from "react-tooltip";
import SmallLoad from "../../../../components/SmallLoad";
import reloadPNG from "../../../../assets/images/reload.png";
import deletePNG from "../../../../assets/images/delete.png";
import undeletePNG from "../../../../assets/images/undelete.png";
import viewPNG from "../../../../assets/images/view.png";
import styled from "styled-components";
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

const NotesHeader = styled.div`
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

const NotesHeaderRight = styled.div`
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

const NotesListContainer = styled.div`
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

const NotesListHeader = styled.div`
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

const NotesListElement = styled.div`
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

const NotePointer = styled.p`
  cursor: pointer;
`;

const ActionIcon = styled.img`
  width: 1rem;
  cursor: pointer;

  @media screen and (min-width: 768px){
    width: 2rem;
  }
`;

const NotesList = styled.div`
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

const Note = styled.div`
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

function Notes () {
  const [loading, setLoading] = useState(false);
  const [confirmUndeleteOpen, setConfirmUndeleteOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [noteID, setNoteID] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sortOrder, setSortOrder] = useState({ type: "", ascending: false });
  const [notesList, setNotesList] = useState([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [notesLimit, setNotesLimit] = useState(10);
  const { addNotification } = useNotify();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  async function fetchNotes(append = false) {
    try {
      setLoading(true);
      const response = await getDeletedNotes(notesLimit);
  
      if (response.success) {
        setTotalNotes(response.total);
        const undeletedNotes = response.notes
          .filter((note) => note.isDeleted)
          .sort((a, b) => new Date(a.collection_date) - new Date(b.collection_date));

        setNotesList((prevList) => {
          const newList = append ? [...prevList, ...undeletedNotes] : undeletedNotes;
          return newList.filter((note, index, self) =>
            index === self.findIndex((c) => c.id === note.id)
          );
        });
      } else{
        setNotesList([]);
        setTotalNotes(0);
      }
  
      setSortOrder({ type: "Data/Hora", ascending: true });
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    document.title = "Eliza | Dashboard";
    fetchNotes();
  }, []);

  function orderList(type) {
    setNotesList((prevList) => {
      let sortedList = [...prevList];
      const isAscending = sortOrder.type === type ? !sortOrder.ascending : true;

      switch (type) {
        case "Empresa":
          sortedList.sort((a, b) =>
            isAscending ? a.company.localeCompare(b.company) : b.company.localeCompare(a.company)
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
          sortedList.sort((a, b) => (isAscending ? a.itens.length - b.itens.length : b.itens.length - a.itens.length));
          break;
        case "Coleta":
          sortedList.sort((a, b) =>
            isAscending
              ? new Date(a.collection_date) - new Date(b.collection_date)
              : new Date(b.collection_date) - new Date(a.collection_date)
          );
          break;
        default:
          return prevList;
      }
      setSortOrder({ type, ascending: isAscending });
      return [...sortedList];
    });
  }

  async function handleDeleteNote() {
    setModalLoading(true);
    try {
      const response = await deleteNote(noteID);

      if (response.success) {
        fetchNotes(false);
      }

      setConfirmDeleteOpen(false);
      addNotification(response.message);
    } catch (error) {
      console.log(error);
    }
    setModalLoading(false);
  }

  async function handleRemFromBin() {
    setModalLoading(true);
    try {
      const response = await remNoteFromBin(noteID);

      if (response.success) {
        fetchNotes(false);
      }

      setConfirmUndeleteOpen(false);
      addNotification(response.message);
    } catch (error) {
      console.log(error);
    }
    setModalLoading(false);
  }

  function openConfirmDelete(id) {
    setConfirmDeleteOpen(true);
    setNoteID(id);
    setConfirmationText("Tem certeza que deseja excluir essa nota?");
  }

  function openConfirmUndelete(id) {
    setConfirmUndeleteOpen(true);
    setNoteID(id);
    setConfirmationText("Tem certeza que deseja restaurar essa nota?");
  }

  function handleReloadNotes() {
    setNotesLimit(10);
    fetchNotes(false);
  }

  function handleLoadMore() {
    setNotesLimit((prev) => prev + 10);
    fetchNotes(true);
  }

  const headerList = [
    { name: "Empresa", action: () => orderList("Empresa") },
    { name: "T. Itens", action: () => orderList("T. Itens") },
    { name: "Data/Hora", action: () => orderList("Data/Hora") },
    { name: "Coleta", action: () => orderList("Coleta") },
    { name: "Ações" }
  ];

  return (
    <Container>
      <NotesHeader>
        <Title>
          Lixeira de Notas
        </Title>

        <NotesHeaderRight>
          <p>Total: {totalNotes}</p>

          <ReloadIcon onClick={handleReloadNotes} src={reloadPNG} alt="reload"/>
        </NotesHeaderRight>
      </NotesHeader>
      
      <NotesListContainer>
        <NotesListHeader>
          {headerList.map((header) => (
            <NotesListElement key={header.name} isHeader>
              {header.action ? (
                <NotePointer onClick={header.action}>
                  {header.name} {sortOrder.type === header.name && (sortOrder.ascending ? "▲" : "▼")}
                </NotePointer>
              ) : (
                header.name
              )}
            </NotesListElement>
          ))}
        </NotesListHeader>

        {loading ? <SmallLoad/> : 
          notesList.length !== 0 ?
            <NotesList>
              {notesList.map((note) => (
                <Note key={`${note.id}-${note.created_at}`}>
                  <NotesListElement>{note.company}</NotesListElement>
                  <NotesListElement>{note.itens.length}</NotesListElement>
                  <NotesListElement>
                    {new Date(note.created_at).toLocaleString("pt-BR", {
                        timeZone: "America/Sao_Paulo",
                        dateStyle: "short",
                        timeStyle: "short"
                    })}
                  </NotesListElement>
                  <NotesListElement>
                    {new Date(note.collection_date).toLocaleString("pt-BR", {
                        timeZone: "UTC",
                        dateStyle: "short",
                    })}
                  </NotesListElement>
                  <NotesListElement>
                    <ActionIcon data-tooltip-id="delete" onClick={() => openConfirmDelete(note.id)} src={deletePNG} alt="Deletar"/>
                    <ActionIcon data-tooltip-id="remove" onClick={() => openConfirmUndelete(note.id)} src={undeletePNG} alt="Recuperar"/>
                    <ActionIcon data-tooltip-id="view" onClick={() => {window.open(`/dashboard/view/note/${note.id}`, "_blank")}} src={viewPNG} alt="Visualizar"/>

                    <Tooltip id="delete" place="top" content="Deletar nota"/>
                    <Tooltip id="remove" place="top" content="Restaurar nota"/>
                    <Tooltip id="view" place="top" content="Visualizar nota"/>
                  </NotesListElement>
                </Note>
              ))}
                {notesLimit < totalNotes && (
                  <NotesListElement>
                    <LoadMoreButton onClick={handleLoadMore}>Carregar mais</LoadMoreButton>
                  </NotesListElement>
                )}
            </NotesList>
          : <p>Nenhum registro encontrado.</p>
        }
      </NotesListContainer>

      <ConfirmModal isOpen={confirmDeleteOpen} setIsOpen={setConfirmDeleteOpen} text={confirmationText} action={handleDeleteNote} modalLoading={modalLoading}/>
      <ConfirmModal isOpen={confirmUndeleteOpen} setIsOpen={setConfirmUndeleteOpen} text={confirmationText} action={handleRemFromBin} modalLoading={modalLoading}/>
    </Container>
  );
}

export default Notes