import { Redirect, Route } from "react-router-dom";
import { useUser } from "../hooks/user";
import Layout from "./layout";
import { useHistory } from "react-router";
import { useSwipeable } from "react-swipeable";

export default function PrivateRoute({ children, ...rest }) {
  const history = useHistory();
  const handlers = useSwipeable({
    onSwipedRight: (eventData) => {
      history.goBack();
    },
  });
  const { user } = useUser();

  return (
    <div {...handlers}>
      <Route
        {...rest}
        render={({ location }) => {
          return user && user?.access ? (
            <>
              <Layout />
              {children}
            </>
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location },
              }}
            />
          );
        }}
      />
    </div>
  );
}
