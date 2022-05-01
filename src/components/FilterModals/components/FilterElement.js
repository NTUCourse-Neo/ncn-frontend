import { Button, Badge } from '@chakra-ui/react';

// Buttons in filter modal
function FilterElement({ id, name, selected, onClick }) {
    return (
        <Button
            colorScheme="teal"
            variant={!selected ? 'outline' : 'solid'}
            size="sm"
            minW="100px"
            m="1"
            onClick={onClick}
            _hover={!selected ? { bg: 'teal.100' } : { bg: 'red.700' }}
        >
            <Badge mx="2" colorScheme="blue">
                {id}
            </Badge>
            {name}
        </Button>
    );
}
export default FilterElement;
