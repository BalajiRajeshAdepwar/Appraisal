import appraisalReducer, {
    fetchAppraisals,
    submitAppraisal,
    updateAppraisal,
    finalizeAppraisal,
    fetchEmployeeHistory,
    fetchManagerHistory,
    fetchAdminHistory,
  } from "../appraisalSlice"; 
  import { configureStore } from "@reduxjs/toolkit";
  import axios from "axios";
  import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
  
  const API_URL = "http://localhost:5000";
  
  describe("appraisalSlice", () => {
    let mockAxios;
    let store;
  
    beforeEach(() => {
      mockAxios = new MockAdapter(axios);
      localStorage.clear();
      store = configureStore({ reducer: appraisalReducer });
    });
  
    afterEach(() => {
      mockAxios.reset();
    });
  
    test("should return the initial state", () => {
      const initialState = {
        data: [],
        history: [],
        loading: false,
        finalizedApprovals: [],
        adminHistory: [],
      };
      expect(appraisalReducer(undefined, {})).toEqual(initialState);
    });
  
    test("should fetch appraisals for an employee", async () => {
      const mockAppraisals = [{ id: 1, employeeId: 100, title: "Goal Data" }];
      const mockUsers = [{ id: 100, name: "John Doe" }];
      mockAxios.onGet(`${API_URL}/appraisals?employeeId=100`).reply(200, mockAppraisals);
      mockAxios.onGet(`${API_URL}/users`).reply(200, mockUsers);
  
      const initialState = { auth: { user: { id: 100, role: "employee" } } };
      const store = configureStore({ reducer: appraisalReducer, preloadedState: initialState });
  
      await store.dispatch(fetchAppraisals("employee"));
  
      expect(store.getState().data).toEqual([{ id: 1, employeeId: 100, title: "Goal Data", employeeName: "John Doe" }]);
    });
  
    test("should submit a new appraisal", async () => {
      const newGoal = { id: 2, title: "New Goal" };
      mockAxios.onPost(`${API_URL}/appraisals`).reply(200, newGoal);
  
      await store.dispatch(submitAppraisal(newGoal));
  
      expect(store.getState().data).toContainEqual(newGoal);
    });
  
    
    test("should fetch admin history", async () => {
      const mockAdminHistory = [
        { id: 8, employeeId: 900, title: "Reviewed Appraisal", status: "Finalized" },
      ];
    
      mockAxios.onGet(`${API_URL}adminHistory`).reply(200, mockAdminHistory);
    
      await store.dispatch(fetchAdminHistory());
    
      expect(store.getState().adminHistory).toEqual(expect.arrayContaining(mockAdminHistory));
    });

      test("should update an appraisal", async () => {
        const updatedData = { id: 1, title: "Updated Goal" }; 
        mockAxios.onGet(`${API_URL}/appraisals/1`).reply(200, { id: 1, title: "Old Goal" });
        mockAxios.onPatch(`${API_URL}/appraisals/1`).reply(200, updatedData);
      
        const initialState = { data: [{ id: 1, title: "Old Goal" }] };
        const store = configureStore({ reducer: appraisalReducer, preloadedState: initialState });
      
        await store.dispatch(updateAppraisal(updatedData));
      
        expect(store.getState().data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 1, title: "Updated Goal" }), 
          ])
        );
      });
      
    test("should finalize an appraisal", async () => {
      const mockAppraisal = { id: 4, employeeId: 300, title: "Appraisal 4", status: "Reviewed" };
      mockAxios.onGet(`${API_URL}/appraisals/4`).reply(200, mockAppraisal);
      mockAxios.onPost(`${API_URL}/adminHistory`).reply(200);
      mockAxios.onPatch(`${API_URL}/appraisals/4`).reply(200);
  
      await store.dispatch(finalizeAppraisal({ id: 4, rating: "A", adminAction: "Approved" }));
  
      expect(store.getState().finalizedApprovals).toContainEqual(expect.objectContaining({ id: 4, status: "Finalized" }));
    });
  
    test("should fetch employee history", async () => {
        const mockHistory = [
          {
            id: 5,
            employeeId: 400,
            title: "Past Goal",
            status: "Finalized",
            adminAction: "Pending",
            managerFeedback: "Pending",
            rating: "Pending",
          },
        ];
      
        mockAxios.onGet(`${API_URL}/adminHistory?employeeId=400`).reply(200, mockHistory);
      
        const initialState = { auth: { user: { id: 400 } } };
        const store = configureStore({ reducer: appraisalReducer, preloadedState: initialState });
      
        await store.dispatch(fetchEmployeeHistory());
      
        expect(store.getState().history).toEqual(
          expect.arrayContaining([
            expect.objectContaining(mockHistory[0]), 
          ])
        );
      });
      
  
      test("should fetch manager history", async () => {
        const mockAppraisals = [{ id: 6, employeeId: 500, title: "Manager Review", managerId: 600 }];
        const mockUsers = [{ id: 500, name: "Jane Doe" }];
        
        mockAxios.onGet(`${API_URL}/finalizedApprovals`).reply(200, mockAppraisals);
        mockAxios.onGet(`${API_URL}/users`).reply(200, mockUsers);
        
        const initialState = { auth: { user: { id: 600 } } };
        const store = configureStore({ reducer: appraisalReducer, preloadedState: initialState });
        
        await store.dispatch(fetchManagerHistory());
        
        expect(store.getState().history).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 6, employeeName: "Jane Doe" }),
          ])
        );
      });      

  });
  