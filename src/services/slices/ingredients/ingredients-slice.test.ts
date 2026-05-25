import { testIngredients } from '../../../constants/test-ingredients';
import { ingredientsReducer } from './ingredients-slice';
import { getIngredientsThunk } from './ingredients-slice';
import * as api from '@api';


describe('getIngredientsThunk', () => {
  it('успешный запрос должен вернуть данные', async () => {
    jest.spyOn(api, 'getIngredientsApi').mockResolvedValue(testIngredients);

    const dispatch = jest.fn();
    const thunk = getIngredientsThunk();

    await thunk(dispatch, () => ({}), undefined);

    // pending
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: getIngredientsThunk.pending.type })
    );
    // fulfilled
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: getIngredientsThunk.fulfilled.type,
        payload: testIngredients
      })
    );
  });

  it('ошибка должна вернуть rejectWithValue', async () => {
    jest.spyOn(api, 'getIngredientsApi').mockRejectedValue(new Error('API error'));

    const dispatch = jest.fn();
    const thunk = getIngredientsThunk();

    await thunk(dispatch, () => ({}), undefined);

    // pending
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: getIngredientsThunk.pending.type })
    );
    // rejected
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: getIngredientsThunk.rejected.type,
        payload: 'API error'
      })
    );
  });
});

const initialState = {
  ingredients: [],
  loading: false,
  error: null
};

describe('ingredientsSlice', () => {
  it('pending: должен установить loading=true и error=null', () => {
    const action = { type: getIngredientsThunk.pending.type };
    const result = ingredientsReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('fulfilled: должен установить loading=false и обновить ингредиенты', () => {
    const action = {
      type: getIngredientsThunk.fulfilled.type,
      payload: testIngredients
    };
    const result = ingredientsReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      loading: false,
      ingredients: testIngredients
    });
  });

  it('rejected: должен установить loading=false и записать ошибку', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = {
      type: getIngredientsThunk.rejected.type,
      payload: errorMessage
    };
    const result = ingredientsReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });
});