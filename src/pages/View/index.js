import { useParams } from "react-router-dom";
import { getNoteById } from "../../services/notes";
import styled from "styled-components";
import { useEffect, useState } from "react";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    gap: 1rem;
    min-height: 100vh;
    background-color: white;
`;

function View() {
    const [ note, setNote ] = useState([]);
    const [ noteItens, setNoteItens ] = useState([]);
    const { noteID } = useParams();

    async function fetchNoteById() {
        try {
            const response = await getNoteById(noteID);

            if (!response.success) {
                throw new Error(response.message)
            } else {
                setNote(response.note);
                setNoteItens(response.note.itens);
                document.title = `View NF | ${response.note.company}`
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        document.title = "View NF";

        fetchNoteById();
    }, []);

    return (
        <Container>
            <h1>View</h1>

            <h2>ID</h2>
            <p>{note.id}</p>

            <h2>Empresa</h2>
            <p>{note.company}</p>

            <h2>Itens</h2>
            {noteItens.map((item, index) => (
                <>
                    <p key={index}>{item.codigo}</p>
                    <p key={index}>{item.quantidade}</p>
                </>
            ))}

            <h2>Boleto</h2>
            <p>{note.ticket ? "Sim" : "Nao"}</p>

            <h2>Usuario</h2>
            <p>{note.user_add}</p>

            <h2>Data de coleta</h2>
            <p>{note.collection_date}</p>

            <h2>Data</h2>
            <p>{note.created_at}</p>
        </Container>
    );
}

export default View;