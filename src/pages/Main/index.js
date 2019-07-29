import React, { useState, useEffect } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import api from '../../services/api';

import { Container, Form, Input, SubmitButton, List, User, Avatar, Name, Bio, ProfileButton, ProfileButtonText } from './styles';

export default function Main(props) {
  const [newUser, setNewUser] = useState('alextavella');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const userKey = 'users';

  useEffect(() => {
    const loadUsers = async () => {
      const users = await AsyncStorage.getItem(userKey);
      if (users) {
        setUsers(JSON.parse(users));
        setNewUser('');
      }
    }

    loadUsers();
  }, []);

  useEffect(() => {
    if (users && users.length > 0) {
      AsyncStorage.setItem(userKey, JSON.stringify(users));
    }
  }, [users]);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    const response = await api.get(`/users/${newUser}`);

    setLoading(false);

    if (!response || !response.data) return;

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    }

    setUsers([...users, data]);
    setNewUser('');

    Keyboard.dismiss();
  }

  const handleNavigate = (user) => {
    const { navigation } = props;

    navigation.navigate('User', { user });
  }

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Add user"
          value={newUser}
          onChangeText={(text) => setNewUser(text)}
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
        />
        <SubmitButton onPress={handleSubmit} loading={loading}>
          {loading ?
            <ActivityIndicator color="#FFF" /> :
            <Icon name="add" size={20} color="#FFF" />
          }
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({ item }) => (
          <User>
            <Avatar source={{ uri: item.avatar }}></Avatar>
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>

            <ProfileButton onPress={() => handleNavigate(item)}>
              <ProfileButtonText>Ver perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
}

Main.navigationOptions = {
  title: 'Users'
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func
  }).isRequired,
}
