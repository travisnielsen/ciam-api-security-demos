import { Component, Fragment } from 'react';
import Modal from 'react-modal'

export default class Profile extends Component {

    state = { isOpen = false }

    openProfile() { this.state.isOpen = true }

    render () {
        return (
            <Fragment>
              <Modal isOpen={this.state.isOpen}>
                <iframe src={"http://cnn.com"} />
              </Modal>
            </Fragment>
          )
    }

    /*
      <Modal isOpen={modalIsOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal} style={customStyles} contentLabel="Example Modal" >
          <iframe src="http://google.com" />
       </Modal>
    */

}