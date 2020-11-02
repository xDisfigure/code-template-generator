import React from 'react'

import styles from './#{STYLESHEET_NAME}.css'

interface Props {
  //
}

const #{COMPONENT_NAME}: React.FC<Props> = ({ children }) => {
    return (<div className={styles.Container}>{children}</div>)
}

export default #{COMPONENT_NAME}