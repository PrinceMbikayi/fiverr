import { useNavigationState } from '@react-navigation/native';

export const useFullRouteNames = () => {
  // Grab the root navigation state
  return useNavigationState((state) => {
    if (!state) return [];

    const routeNames = [];
    let currentState = state;

    // Walk down through nested states
    while (currentState) {
      const route = currentState.routes[currentState.index];
      routeNames.push(route.name);

      currentState = route.state; // drill down into nested navigator state
    }

    return routeNames;
  });
}
