import { useContext, useState } from "react"
import styled from "styled-components"
import { editProduct, getProducts } from "../../services/products"
import CircleLoad from "../CircleLoad"
import SearchBar from "../Inputs/SearchBar"
import { ReactComponent as CloseSVG } from "../../assets/svg/close.svg"
import { addPrint } from "../../services/prints"
import { AuthContext } from "../../hooks/Authentication/authContext"
import { useNotify } from "../../hooks/Notify/notifyContext"
import { Tooltip } from "react-tooltip"
import savePNG from "../../assets/images/confirm.png"
import removePNG from "../../assets/images/remove.png"
import editPNG from "../../assets/images/edit.png"
import printerPNG from "../../assets/images/printer.png"

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s ease-in-out;
    z-index: ${(props) => (props.isOpen ? 1000 : -1)};

    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};
`

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: .8rem;
    overflow: hidden;
    max-height: 75vh;
    width: 75vw;
    padding: 2rem;
    background-color: var(--secondary-color);
    font-family: "Nunito Sans", sans-serif;
    transform: ${(props) => (props.isOpen ? "scale(1)" : "scale(0.9)")};
    opacity: ${(props) => (props.isOpen ? "1" : "0")};
    transition: all 0.5s ease-in-out;

    @media screen and (min-width: 625px){
        width: 60vw;
    }

    @media screen and (min-width: 1000px){
        width: 35vw;
    }

    @media screen and (min-width: 1000px) and (min-height: 925px){
        width: 30vw;
        height: 60vh;
    }
`

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
`

const Texts = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--background);
    gap: 1rem;
`

const ResultsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 1rem;
`

const Title = styled.h1`
    color: var(--login-text-color);
    font-family: "Nunito Sans";
    font-size: 2rem;
    font-weight: 700;
`

const FormContainer = styled.form`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 2.5rem;
`

const ProductsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
    max-height: 50vh;
    width: 100%;
    box-sizing: border-box;
    overflow-y: auto;

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
`

const Product = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: .5rem;
    border-radius: .5rem;
    padding: .8rem .8rem;
    box-sizing: border-box;
    width: 100%;
    border: 0.6px solid var(--dashboard-border-color);
    background: #F5F6FA;
`

const ActionImage = styled.img`
    width: 2rem;
    height: 2rem;
    cursor: pointer;
`

const ProductsInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: .8rem;
`

const EditContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: .5rem;
    box-sizing: border-box;
    width: 100%;
`

const Input = styled.input`
    width: 100%;
    padding: .4rem;
    border-radius: .4rem;
    border: none;
    font-size: 1rem;
    font-weight: bold;
    background-color: transparent;
    color: var(--background);

    &:focus{
        outline: none;
    }
`

const Description = styled.p`
    font-size: 1rem;
    font-weight: bold;
    color: var(--background);
`

const Detail = styled.p`
    font-size: .9rem;
    padding: .5rem;
    border-radius: .5rem;
    font-weight: bold;
`

const ProductInfos = styled.div`
    display: flex;
    flex-direction: row;
    gap: .5rem;
`

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 10px;
    right: 10px;
    gap: 1rem;
`

const Button = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border-radius: .5rem;
    color: black;
    font-size: 1rem;
    pointer-events: ${props => props.disable ? 'none' : 'auto'};
    cursor: ${props => props.disable ? 'not-allowed' : 'pointer'};
    transition: all 0.3s ease-in-out;

    & svg{
        fill: var(--background);
    }
`;


function NewPlateModal({isOpen, setIsOpen, title, fetchPlates}){
    const { user } = useContext(AuthContext);
    const { addNotification } = useNotify();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [newDescription, setNewDescription] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSearch(e) {
        setLoading(true);
        e.preventDefault();
        
        try {
            const response = await getProducts(search);

            if(response.success === true){
                setProducts(response.products);
            }else{
                setProducts([]);
            }
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    }

    function handleEdit(product) {
        setEditingProduct(product.ean);
        setNewDescription(product.description);
    }

    function handleCancelEdit() {
        setEditingProduct(null);
        setNewDescription('');
    }

    async function handleSaveEdit(product) {
        console.log(product);
        try {
            const response = await editProduct(product.ean, newDescription);

            if(response.success){
                product.description = newDescription;
                setEditingProduct(null);
                addNotification(response.message);
            }
        } catch (error) {
            console.log(error);
            addNotification('Erro ao atualizar descrição');
        }
    }

    async function handlePrint(product){
        setLoading(true);

        const reqBody = {
            ean: product.ean,
            description: product.description,
            price: product.price,
            type: product.type,
            user_add: user.username
        }

        try {
            const response = await addPrint(reqBody);

            if(response.success === true){
                addNotification(response.message);
                setIsOpen(false);
                fetchPlates();
            } else {
                addNotification(response.message || "Erro ao adicionar impressão");
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    const handleCancel = () => {
        setIsOpen(false);
    };    

    return(
        <Container isOpen={isOpen}>
            <ModalContainer isOpen={isOpen}>
                <ModalContent>
                    <ButtonsContainer>
                        <Button disable={loading} onClick={handleCancel}><CloseSVG/></Button>
                    </ButtonsContainer>

                    <Texts>
                        <Title>{title}</Title>
                    </Texts>

                    <ResultsContainer>
                        <FormContainer onSubmit={(e) => handleSearch(e)}>
                            <SearchBar setValue={setSearch} type="text" placeholder="Digite a descrição ou código do produto"/>
                        </FormContainer>

                        {loading ? (
                            <CircleLoad />
                        ) : products && products.length > 0 ? (
                            <ProductsContainer>
                                {products.map((product) => {
                                    const isEditing = editingProduct === product.ean;
                                    return (
                                        <Product key={product.ean}>
                                            <ProductsInfoContainer>
                                                {isEditing ? (
                                                    <EditContainer>
                                                        <Input
                                                            type="text"
                                                            value={newDescription}
                                                            onChange={(e) => setNewDescription(e.target.value)}
                                                        />
                                                        <>
                                                            <ActionImage
                                                                data-tooltip-id="save"
                                                                src={savePNG}
                                                                onClick={() => handleSaveEdit(product)}
                                                            />
                                                            <ActionImage
                                                                data-tooltip-id="cancel"
                                                                src={removePNG}
                                                                onClick={handleCancelEdit}
                                                            />
                                                            <Tooltip id="save" place="top" content="Salvar" />
                                                            <Tooltip id="cancel" place="top" content="Cancelar" />
                                                        </>
                                                    </EditContainer>
                                                ) : (
                                                    <>
                                                        <Description>{product.ean} - {product.description}</Description>
                                                        <ProductInfos>
                                                            <Detail style={{ color: "green", backgroundColor: "rgba(0, 128, 0, 0.2)" }}>
                                                                {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                            </Detail>
                                                            <Detail style={{ color: "var(--background)", backgroundColor: "rgba(0, 23, 128, 0.2)" }}>
                                                                {product.type}
                                                            </Detail>
                                                        </ProductInfos>
                                                    </>
                                                )}
                                            </ProductsInfoContainer>

                                            {!isEditing && (
                                                <>
                                                    <ActionImage
                                                        data-tooltip-id="printer"
                                                        src={printerPNG}
                                                        onClick={() => handlePrint(product)}
                                                    />
                                                    <ActionImage
                                                        data-tooltip-id="edit"
                                                        src={editPNG}
                                                        onClick={() => handleEdit(product)}
                                                    />
                                                    <Tooltip id="printer" place="top" content="Imprimir" />
                                                    <Tooltip id="edit" place="top" content="Editar" />
                                                </>
                                            )}
                                        </Product>
                                    );
                                })}
                            </ProductsContainer>
                        ) : (
                            <Product style={{ justifyContent: "center" }}>
                                <p style={{ fontWeight: "bold", color: "var(--background)" }}>Nenhum produto encontrado</p>
                            </Product>
                        )}
                    </ResultsContainer>
                </ModalContent>
            </ModalContainer>
        </Container>
    )
}

export default NewPlateModal