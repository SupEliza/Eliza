import styled from "styled-components";

const Input = styled.input`
    width: 100%;
    box-sizing: border-box;
    border-radius: .5rem;
    border: 1px solid #D8D8D8;
    color: var(--login-text-color);
    font-family: "Nunito Sans";
    font-size: 1.125rem;
    padding: .8rem;
    background: #F1F4F9;

    &:focus-visible{
        outline: none;
    }

    &::placeholder{
        color: #A6A6A6;
        font-family: "Nunito Sans";
        font-size: 1.125rem;
    }

    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`

function TextInput({setValue, placeholder, type, inputValue}){
    return(
        <Input 
            type={type} 
            value={inputValue || ""}
            placeholder={placeholder}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}

export default TextInput;