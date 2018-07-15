import * as React from 'react';
import { List } from './List';

type Props = {
    data: any[];
}

export const UserList = (props: Props) => (
    <List data={props.data} filter={true} />
)