import React, { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

import { Foods } from '../../types';

export default function Dashboard() {
  const [foods, setFoods] = useState<Foods[]>([]);
  const [editingFood, setEditingFood] = useState<Foods>({} as Foods);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFood() {
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    loadFood();
  }, [])


  async function handleAddFood(food: Foods) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([
        ...foods,
        response.data
      ]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: Foods) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(foodId: number) {
    const updateFood = [...foods]

    await api.delete(`/foods/${foodId}`);

    const foodsFiltered = updateFood.filter(food => food.id !== foodId);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: Foods) {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}


