import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import { Container, Header, Avatar, Name, Bio, Stars, Starred, OwnerAvatar, Info, Title, Author } from './styles';

export default function User(props) {
  const [loading, setLoading] = useState(true);
  const [user,] = useState(props.navigation.getParam('user'));
  const [stars, setStars] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const response = await api.get(`/users/${user.login}/starred`);
      console.tron.log(response);

      setStars(response.data);
      setLoading(false)
    }

    loadUser();
  }, []);

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar }}></Avatar>
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>

      <Stars
        data={stars}
        keyExtractor={star => String(star.id)}
        renderItem={({ item }) => (
          <Starred>
            <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
            <Info>
              <Title>{item.name}</Title>
              <Author>{item.owner.login}</Author>
            </Info>
          </Starred>
        )}
      />
    </Container>
  );
}

User.navigationOptions = (props) => ({
  title: props.navigation.getParam('user').name
})

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired
}
