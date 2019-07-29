import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import { Container, Header, Avatar, Name, Bio, Stars, Starred, OwnerAvatar, Info, Title, Author } from './styles';

export default function User(props) {
  const [loading, setLoading] = useState(false);
  const [block, setBlock] = useState(false);

  const [user,] = useState(props.navigation.getParam('user'));
  const [stars, setStars] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadUser = async () => {
      if (loading || block) return;
      setLoading(true);

      const response = await api.get(`/users/${user.login}/starred?page=${page}`);
      if (response && response.data && response.data.length === 0) {
        setBlock(true);
      }

      setStars([...stars, ...response.data]);
      setLoading(false);
    }

    loadUser();
  }, [page, block]);

  const handlePage = () => {
    setPage(page + 1);
  }

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
        onEndReached={handlePage}
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

      {loading && <ActivityIndicator color="#333" />}
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
