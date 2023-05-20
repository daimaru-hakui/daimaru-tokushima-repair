import { useQueryFactories } from '@/hooks/settings/useQueryFactories';
import { Box, Button, FileInput, Image, Input, NumberInput, Paper, Select, Stack, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

const Templatesnew = () => {
  const { data: factories } = useQueryFactories();
  const [factory, setFactory] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>();

  const { register, handleSubmit, getValues } = useForm();
  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!factory) return;
    console.log({ ...data, factory_id: factory, path: uploadFile });
  };

  const handleImageChange = (e: File | null) => {
    if (!e || e.length == 0) {
      return;
    }
    console.log(e);
    setUploadFile(e);
  };

  return (
    <Paper w="100%"
      maw="1050px"
      shadow="md"
      radius="md"
      p="lg"
      m="auto"
      withBorder>
      <Box>修理・マークのテンプレートを作成する</Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          {factories && (
            <Select
              required
              label="工場名"
              placeholder='工場を選択してください'
              value={factory}
              onChange={(e: string) => setFactory(e)}
              data={factories?.map((factory) => (
                { value: factory.id, label: factory.name }
              ))}
            />
          )}
          <NumberInput
            w="100%"
            label='価格'
            required
            {...register(`price`, {
              required: true,
            })}
            onChange={() => getValues()}
            max={1000000}
            min={0}
          />
          <TextInput label="修理名" {...register('title')} />
          <FileInput
            placeholder="修理・マーク伝票ファイル"
            label="ファイルをアップロード"
            withAsterisk
            value={uploadFile}
            onChange={handleImageChange}
          />
          <Button type="submit" color="teal">登録</Button>
          {uploadFile && (
            <>
              <Button onClick={() => setUploadFile(null)}>キャンセル</Button>
              <Image src={URL.createObjectURL(uploadFile)} alt={uploadFile.name} />
            </>
          )}
        </Stack>
      </form>
    </Paper >
  );
};

export default Templatesnew;