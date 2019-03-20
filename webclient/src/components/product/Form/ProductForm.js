import React, { useReducer, useRef, useEffect } from "react";

//Local
import OptionButtonGroup from "./../../Common/OptionButtonGroup";
import Selection from "./../../Common/Selection";

//style component
import { Column } from "./../../style/grid";
import { FormRow, Button, TextBox } from "./../../style/form";

//private
import reducerMiddleware from "./reducerMiddleware";
import reducer from "./reducer";
import { initialState } from "./initialState";
import {
  NAME_CHANGE,
  CATEGORY_CHANGE,
  EXPIRY_CHANGE,
  IS_EXPIRY_CHANGE,
  PRICE_CHANGE,
  SIZE_CHANGE,
  DESCRIPTION_CHANGE,
  SAVE_INIT
} from "./actionTypes";
import { save } from "./actionCreator";

const sizeItems = [
  {
    value: "1",
    description: "Small"
  },
  {
    value: "2",
    description: "Medium"
  },
  {
    value: "3",
    description: "Large"
  }
];

export default function ProductForm({ match }) {
  const [state, dispatchBase] = useReducer(reducer, initialState);
  const dispatch = reducerMiddleware(dispatchBase);

  const inputElementName = useRef(null);
  const inputElementCategory = useRef(null);
  const inputElementExpiryDate = useRef(null);
  const inputElementIsExpiry = useRef(null);
  const inputElementPrice = useRef(null);
  const inputElementSize = useRef(null);
  const inputElementDescription = useRef(null);
  const inputElementSubmit = useRef(null);

  //add all elements into array, so that will move next
  let currentFocusElementIndex = 0;
  const AllInputElements = [
    inputElementName,
    inputElementCategory,
    inputElementExpiryDate,
    inputElementIsExpiry,
    inputElementPrice,
    inputElementSize,
    inputElementDescription,
    inputElementSubmit
  ];

  useEffect(() => {
    inputElementName.current.focus();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: SAVE_INIT });
    dispatch(save(state));
  }

  function KeyDownEvent(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      currentFocusElementIndex++;
      if (AllInputElements[currentFocusElementIndex]) {
        AllInputElements[currentFocusElementIndex].current.focus();
      } else {
        currentFocusElementIndex = 0;
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormRow>
        <Column span="3">
          <label htmlFor="name">Name</label>
        </Column>
        <Column span="9">
          <TextBox
            type="text"
            id="name"
            name="name"
            ref={inputElementName}
            onKeyDown={KeyDownEvent}
            value={state.name}
            onChange={e =>
              dispatch({ type: NAME_CHANGE, data: e.target.value })
            }
            required
          />
        </Column>
      </FormRow>

      <FormRow>
        <Column span="3">
          <label htmlFor="category">Category</label>
        </Column>
        <Column span="9">
          <Selection
            ApiUrl="category/search"
            id="category"
            name="category"
            minimumInputLength={2}
            Ref={inputElementCategory}
            onInputKeyDown={KeyDownEvent}
            value={{ value: state.category.id, label: state.category.name }}
            onChange={e =>
              dispatch({
                type: CATEGORY_CHANGE,
                data: { id: e.value, name: e.label }
              })
            }
          />
        </Column>
      </FormRow>

      <FormRow>
        <Column span="3">
          <label htmlFor="expiryDate">Expiry Date</label>
        </Column>
        <Column span="9">
          <TextBox
            type="date"
            id="expiryDate"
            name="expiryDate"
            ref={inputElementExpiryDate}
            onKeyDown={KeyDownEvent}
            value={state.expiryDate}
            onChange={e =>
              dispatch({ type: EXPIRY_CHANGE, data: e.target.value })
            }
          />
        </Column>
      </FormRow>

      <FormRow>
        <Column span="3">
          <label htmlFor="isExpiry">Is Expiry</label>
        </Column>
        <Column span="9">
          <input
            type="checkbox"
            id="isExpiry"
            name="isExpiry"
            ref={inputElementIsExpiry}
            onKeyDown={KeyDownEvent}
            value={state.isExpiry}
            onChange={e =>
              dispatch({ type: IS_EXPIRY_CHANGE, data: e.target.value })
            }
          />
        </Column>
      </FormRow>

      <FormRow>
        <Column span="3">
          <label htmlFor="price">Price:</label>
        </Column>
        <Column span="9">
          <TextBox
            type="number"
            id="price"
            name="price"
            step="0.25"
            min="0.25"
            max="9999999"
            ref={inputElementPrice}
            onKeyDown={KeyDownEvent}
            value={state.price}
            onChange={e =>
              dispatch({ type: PRICE_CHANGE, data: e.target.value })
            }
          />
        </Column>
      </FormRow>

      <FormRow>
        <Column span="3">
          <label htmlFor="size">Size:</label>
        </Column>
        <Column span="9">
          <OptionButtonGroup
            name="size"
            items={sizeItems}
            Ref={inputElementSize}
            onKeyDown={KeyDownEvent}
            value={state.size}
            onChange={e =>
              dispatch({ type: SIZE_CHANGE, data: e.target.value })
            }
          />
        </Column>
      </FormRow>

      <FormRow>
        <Column span="3">
          <label htmlFor="description">Description:</label>
        </Column>
        <Column span="9">
          <textarea
            id="description"
            name="description"
            ref={inputElementDescription}
            onKeyDown={KeyDownEvent}
            value={state.description}
            onChange={e =>
              dispatch({ type: DESCRIPTION_CHANGE, data: e.target.value })
            }
          />
        </Column>
      </FormRow>

      <FormRow>
        <Column span="3">-</Column>
        <Column span="9">
          <Button primary type="submit" ref={inputElementSubmit}>
            {match.params.mode === "edit" ? "Edit" : "Save"}
          </Button>
        </Column>
      </FormRow>

      <FormRow>
        <Column span="12">
          {state.isProcessing && <div>Adding...</div>}
          {state.isError && <div>Error occured while saving...</div>}
          {state.message && <div>{state.message}</div>}
        </Column>
      </FormRow>
    </form>
  );
}
