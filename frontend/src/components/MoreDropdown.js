import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import styles from "../styles/MoreDropdown.module.css";
import { useHistory } from "react-router";

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu

// Our ThreeDots function needs to be passed a reference to the dropdown.toggle component but the ref can't be treated like a standard prop.
// Just like the key prop, ref is handled differently by react compared to standard props, so to get around this, react-bootstrap uses the forwardRef method
// to pass the ref into our function as a second argument.  ForwardRef is quite extensively used in reusable component libraries like react bootstrap
const ThreeDots = React.forwardRef(({ onClick }, ref) => (
    <i
      className="fas fa-ellipsis-v"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    />
  ));

  // create the menu for our dropdown, for which the boostrap default will be enough
  export const MoreDropdown = ({handleEdit, handleDelete}) => {
    return (
    <Dropdown className="ml-auto" drop="left">
        <Dropdown.Toggle as={ThreeDots} />

        <Dropdown.Menu className="text-center" popperConfig={{strategy: "fixed"}}>
            <Dropdown.Item 
                className={styles.DropdownItem}
                onClick={handleEdit}
                aria-label="edit"
            >
                <i className="fas fa-edit" />
            </Dropdown.Item>
            <Dropdown.Item
                className={styles.DropdownItem}
                onClick={handleDelete}
                aria-label="delete"
            >
                <i className="fas fa-trash-alt" />
            </Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
    );
  };

  export function ProfileEditDropdown({ id }) {
    const history = useHistory();
    return (
      <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left">
        <Dropdown.Toggle as={ThreeDots} />
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => history.push(`/profiles/${id}/edit`)}
            aria-label="edit-profile"
          >
            <i className="fas fa-edit" /> edit profile
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => history.push(`/profiles/${id}/edit/username`)}
            aria-label="edit-username"
          >
            <i className="far fa-id-card" />
            change username
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => history.push(`/profiles/${id}/edit/password`)}
            aria-label="edit-password"
          >
            <i className="fas fa-key" />
            change password
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
 