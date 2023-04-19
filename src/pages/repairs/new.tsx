// import Input from '@mui/joy/Input';
import {
  Button,
  Table,
  TextInput,
  Flex,
  Paper,
  Stack,
  NumberInput,
  Box,
  Input,
  Autocomplete,
  Textarea,
  Radio,
  Group,
} from '@mantine/core';
import MarkRow from '@/conponents/repair/RepairRow';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { MdAddCircle } from 'react-icons/md';
import { RepaireInputs } from '../../../types';
import useStore from '../../../store';
import useRepaireStore from '../../../store/useRepaireStore';
import { RepaireStepper } from '@/conponents/repair/RepaireStepper';
import { RepaireConfirm } from '@/conponents/repair/RepaireConfirm';
import { RepaireComplete } from '@/conponents/repair/RepaireComplete';

const RepairNew = () => {
  const session = useStore((state) => state.session);
  const [dragIndex, setDragIndex] = useState<any>(null);
  const repaire = useRepaireStore((state) => state.repaire);
  const setRepaire = useRepaireStore((state) => state.setRepaire);
  const [active, setActive] = useState(1);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  const defaultProducts = () => {
    const obj = {
      productNumber: '',
      size: '',
      quantity: '',
      comment: '',
    };
    const array = [...Array(5)].map(() => obj);
    return array;
  };
  const { getValues, register, handleSubmit, control } = useForm<RepaireInputs>(
    {
      defaultValues: {
        ...repaire,
        user_id: session?.user.id
      },
    }
  );

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'products',
  });

  const addProduct = () => {
    append({
      productNumber: '',
      size: '',
      quantity: '',
      comment: '',
    });
  };

  const removeProduct = (index: number) => {
    remove(index);
  };

  const onSubmit: SubmitHandler<RepaireInputs> = (data) => {
    nextStep();
    setRepaire(data);

  };
  console.log('repair', repaire);

  // ドラッグ&ドロップ
  const dragStart = (index: any) => {
    setDragIndex(index);
  };

  const dragEnter = (index: any) => {
    if (index === dragIndex) return;
    const startElement = { ...getValues().products[dragIndex] };
    const enterElment = { ...getValues().products[index] };
    update(index, {
      ...startElement,
    });
    update(dragIndex, {
      ...enterElment,
    });
    setDragIndex(index);
  };

  const dragEnd = () => {
    setDragIndex(null);
  };

  const dragOndrop = () => {
    setDragIndex(null);
  };

  return (
    <>
      {session && (

        <Paper w="100%" shadow="md" radius="md" p="lg" withBorder>
          <Flex w="100%" p={24} justify="center"><RepaireStepper active={active} /></Flex>
          {active === 1 && (

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack>
                <Autocomplete
                  w="100%"
                  label="加工場"
                  maw="500px"
                  required
                  defaultValue={repaire?.factory}
                  {...register('factory', { required: true })}
                  onChange={getValues}
                  data={['徳島工場', '大野制帽所', 'ひつじや', 'トシカワ']}
                />
                <Flex
                  gap={16}
                  sx={{ flexDirection: 'column' }}
                  direction={{ sm: 'row' }}
                >
                  <TextInput
                    w="100%"
                    label="顧客名"
                    required
                    {...register('client', { required: true })}
                  />
                  <Autocomplete
                    w="100%"
                    label="納入先"
                    required
                    defaultValue={repaire?.deliveryPlace}
                    {...register('deliveryPlace', { required: true })}
                    onChange={getValues}
                    data={['配送センター', 'ウィルフィット', '神戸店']}
                  />
                </Flex>
                <TextInput
                  w="100%"
                  label="修理名"
                  required
                  {...register('title', { required: true })}
                />
                <Flex gap={16} align="center">
                  <TextInput
                    type="date"
                    w="50%"
                    maw="200px"
                    label="納期"
                    {...register('deadline')}
                  />
                  <NumberInput
                    w="50%"
                    maw="200px"
                    label="価格"
                    required
                    defaultValue={Number(repaire?.price)}
                    {...register('price', { required: true })}
                    onChange={() => (getValues())}
                    max={1000000}
                    min={0}
                  />
                </Flex>
                <Flex gap={5}>
                  <Radio.Group
                    withAsterisk
                    label="タイプ"
                    defaultValue={repaire?.orderType}
                    px={20}
                  >
                    <Group mt="xs">
                      <Radio
                        color="teal"
                        value="REPAIRE"
                        label="修理"
                        {...register('orderType', { required: true })}
                      />
                      <Radio
                        color="teal"
                        value="MARK"
                        label="マーク"
                        {...register('orderType', { required: true })}
                      />
                    </Group>
                  </Radio.Group>
                  <Radio.Group withAsterisk label="区分" defaultValue={repaire?.category}>
                    <Group mt="xs">
                      <Radio
                        color="teal"
                        value="PREV"
                        label="前回通り"
                        {...register('category', { required: true })}
                      />
                      <Radio
                        color="teal"
                        value="NEW"
                        label="新規"
                        {...register('category', { required: true })}
                      />
                    </Group>
                  </Radio.Group>
                </Flex>

                <Box sx={{ overflowX: 'auto' }}>
                  <Table
                    sx={{ width: '1000px' }}
                    w={{ xl: 'auto' }}
                    verticalSpacing="xs"
                    fontSize="md"
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <thead>
                      <tr>
                        <th></th>
                        <th>品名</th>
                        <th>サイズ</th>
                        <th>数量</th>
                        <th>備考</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field, index) => (
                        <MarkRow
                          key={field.id}
                          register={register}
                          getValues={getValues}
                          productIndex={index}
                          removeProduct={removeProduct}
                          dragStart={dragStart}
                          dragEnter={dragEnter}
                          dragEnd={dragEnd}
                          dragOndrop={dragOndrop}
                          dragIndex={dragIndex}
                        />
                      ))}
                    </tbody>
                  </Table>
                </Box>
                <Flex justify="center">
                  <Button
                    color="teal"
                    leftIcon={<MdAddCircle />}
                    variant="outline"
                    size="md"
                    onClick={addProduct}
                  >
                    追加
                  </Button>
                </Flex>
                <Textarea placeholder="コメント" label="コメント" size="sm" {...register('comment')} />
                <Button color="teal" type="submit" fullWidth sx={{ mt: 6 }}>
                  確認画面へ
                </Button>
              </Stack>
            </form>
          )}
          {active === 2 && (
            <>
              <RepaireConfirm />
              <Group position="center" mt="xl">
                <Button variant="default" onClick={prevStep}>戻る</Button>
                <Button color='teal' onClick={nextStep}>確定</Button>
              </Group>
            </>
          )}
          {active === 3 && (
            <RepaireComplete />
          )}
        </Paper>
      )}
    </>
  );
};

export default RepairNew;
